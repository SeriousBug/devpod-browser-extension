# Publishing Instructions

To get the extension published, follow these steps:

1. If you have not already, update the version in `package.json` and merge that change into main.
2. Create a new release on Github, upload the built distribution packages. Use the "Generate changelog" to generate the list of changes.
3. For Chrome:
   1. Go to https://chrome.google.com/webstore/devconsole/
   2. Click "Package" on the left, then press "Upload new package"
   3. Upload the `devpod-ext-chrome-<version>.zip` file.
   4. Update any information needed, then hit "Submit for review"
4. For Edge:
   1. Go to https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview
   2. Select the extension, then press "Update"
   3. Click "Replace" and upload `devpod-ext-chrome-<version>.zip`
   4. Click "Continue", then "Publish"
5. For Firefox:
   1. Go to https://addons.mozilla.org/en-US/developers/addons
   2. Select the extension, then press "Upload New Version"
   3. Upload `devpod-ext-firefox-<version>.zip`. Make sure it's the firefox one!
   4. Answer yes to the next question. Download the zip of the source code from Github (under "Code", at the bottom) and upload the source code.
   5. Copy and paste the changelog from the Github release.
   6. Submit the extension for review.
