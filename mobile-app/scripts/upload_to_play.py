#!/usr/bin/env python3
"""Uploads a signed AAB to Google Play and rolls it out on the production track.

Reads service account credentials from SERVICE_ACCOUNT_PATH and the bundle
path from AAB_PATH (both set as env vars by the GitHub Actions workflow that
calls this script). The versionCode comes from what Play reports back after
the bundle upload, not from an env var, since that's the authoritative value.
"""
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

import jwt

PACKAGE_NAME = "com.nspireapp"
API_BASE = "https://androidpublisher.googleapis.com/androidpublisher/v3"
UPLOAD_API_BASE = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3"


def get_access_token(service_account_path):
    sa = json.load(open(service_account_path))
    now = int(time.time())
    payload = {
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/androidpublisher",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600,
    }
    assertion = jwt.encode(payload, sa["private_key"], algorithm="RS256")
    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": assertion,
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)["access_token"]


def api_request(method, path, token, data=None, headers=None, raw_body=False, upload=False):
    base = UPLOAD_API_BASE if upload else API_BASE
    url = f"{base}{path}"
    hdrs = {"Authorization": f"Bearer {token}"}
    body = None
    if data is not None:
        if raw_body:
            body = data
        else:
            body = json.dumps(data).encode()
            hdrs["Content-Type"] = "application/json"
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, data=body, method=method, headers=hdrs)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        print(f"ERROR {method} {path}: {e.code} {e.read().decode()}")
        raise


def main():
    service_account_path = os.environ["SERVICE_ACCOUNT_PATH"]
    aab_path = os.environ["AAB_PATH"]

    token = get_access_token(service_account_path)

    edit = api_request("POST", f"/applications/{PACKAGE_NAME}/edits", token)
    edit_id = edit["id"]
    print("Created edit:", edit_id)

    aab_size = os.path.getsize(aab_path)
    with open(aab_path, "rb") as f:
        aab_bytes = f.read()
    bundle_resp = api_request(
        "POST",
        f"/applications/{PACKAGE_NAME}/edits/{edit_id}/bundles?uploadType=media",
        token,
        data=aab_bytes,
        headers={"Content-Type": "application/octet-stream", "Content-Length": str(aab_size)},
        raw_body=True,
        upload=True,
    )
    print("Uploaded bundle:", bundle_resp)
    uploaded_version_code = bundle_resp["versionCode"]

    track_body = {
        "releases": [
            {
                "versionCodes": [str(uploaded_version_code)],
                "status": "completed",
                "releaseNotes": [
                    {"language": "en-US", "text": "Bug fixes and mobile experience improvements."}
                ],
            }
        ]
    }
    track_resp = api_request(
        "PUT",
        f"/applications/{PACKAGE_NAME}/edits/{edit_id}/tracks/production",
        token,
        data=track_body,
    )
    print("Track updated:", track_resp)

    commit_resp = api_request(
        "POST", f"/applications/{PACKAGE_NAME}/edits/{edit_id}:commit", token
    )
    print("Edit committed:", commit_resp)
    print(f"SUCCESS: versionCode {uploaded_version_code} submitted to production track.")


if __name__ == "__main__":
    main()
