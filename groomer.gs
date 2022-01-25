const LIST_FOLDER_API = "https://api.dropboxapi.com/2/files/list_folder";
const DELETE_FILES_API = "https://api.dropboxapi.com/2/files/delete_batch";
const TOKEN_API = "https://api.dropboxapi.com/oauth2/token";
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REFRESH_TOKEN = "";
const ACCESS_CODE = "";

async function groomer() {

    // list files in the Screenshots folder
    const filesResponse = await UrlFetchApp.fetch(LIST_FOLDER_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "application/json",
        },
        payload: JSON.stringify({ path: "/Screenshots" }),
    });
    const files = JSON.parse(filesResponse.getContentText());

    // delete all files in screenshot folder, already been backed up to google drive (through IFTTT)
    const deleteResponse = await UrlFetchApp.fetch(DELETE_FILES_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "application/json",
        },
        payload: JSON.stringify({
            entries: files.entries.map((data) => ({ path: data.path_display })),
        }),
    });
  
    Logger.log(deleteResponse.getContentText());
    Logger.log(`Moved ${files.entries.length} files`);
}

async function authorize() {
  const tokenResponse = await UrlFetchApp.fetch(TOKEN_API, {
        method: "POST",
        payload: {
            code: ACCESS_CODE,
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        },
    });
    return JSON.parse(tokenResponse.getContentText());
}

async function getToken() {
    const tokenResponse = await UrlFetchApp.fetch(TOKEN_API, {
        method: "POST",
        payload: {
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        },
    });
    return JSON.parse(tokenResponse.getContentText()).access_token;
}
