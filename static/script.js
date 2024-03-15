var videoIndex = 0; // Keep track of the currently playing video index
var config; // Declare config variable

// Fetch config.json when the page loads
fetch('/static/config.json')
    .then(response => response.json())
    .then(data => {
        config = data; // Assign loaded config to the config variable
        console.log("Config loaded successfully:", config);
    })
    .catch(error => {
        console.error("Error loading config:", error);
    });
    function playFirstVideo() {
        playVideo(0);
    }

function playNextVideo() {
    videoIndex++;
    if (videoIndex >= document.getElementById("videoSelect").options.length) {
        videoIndex = 0; // Reset index if it exceeds the number of options
    }
    playVideo(videoIndex);
}

function playPreviousVideo() {
    videoIndex--;
    if (videoIndex < 0) {
        videoIndex = document.getElementById("videoSelect").options.length - 1; // Set index to last option if it's less than 0
    }
    playVideo(videoIndex);
}

function playVideo(index) {
    document.getElementById("videoSelect").selectedIndex = index; // Set selected index
    makeApiCall('play', '/play'); // Play on servers
}

function makeApiCall(action, endpoint) {
    var selectedVideo = document.getElementById("videoSelect").value;

    config.servers.forEach(function(server) {
        var data = { "filename": server.baseVideoPath + selectedVideo };
        fetch(server.ip + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log("Request sent to " + server.ip + " successfully.");
            } else {
                console.error("Failed to send request to " + server.ip + ". Status code: " + response.status);
            }
        })
        .catch(error => {
            console.error("Error sending request to " + server.ip + ": " + error);
        });
    });
}

function startPlaylist1() {
    sendPlaylistRequest('POST', '/playlist/start', {playlist_name: 'play1.sh'})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error));
}

function startPlaylist2() {
    sendPlaylistRequest('POST', '/playlist/start', {playlist_name: 'randomplaylist1.sh'})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error));
}

function stopPlaylist() {
    sendPlaylistRequest('POST', '/playlist/stop', {})
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error));
}

function sendPlaylistRequest(method, endpoint, data) {
    return Promise.all(config.servers.map(server => {
        return fetch(server.ip + endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log("Playlist request sent to " + server.ip + " successfully.");
                return response.json();
            } else {
                console.error("Failed to send playlist request to " + server.ip + ". Status code: " + response.status);
                throw new Error('Failed to send playlist request');
            }
        })
        .catch(error => {
            console.error("Error sending playlist request to " + server.ip + ": " + error);
            throw error;
        });
    }));
}

function displayPicture() {
    config.servers.forEach(function(server) {
        fetch(server.ip + '/picture?picture_name=black.png')
        .then(response => {
            if (response.ok) {
                console.log("Picture request sent to " + server.ip + " successfully.");
            } else {
                console.error("Failed to send picture request to " + server.ip + ". Status code: " + response.status);
            }
        })
        .catch(error => {
            console.error("Error sending picture request to " + server.ip + ": " + error);
        });
    });
}

function closePicture() {
    config.servers.forEach(function(server) {
        fetch(server.ip + '/close_picture', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                console.log("Close picture request sent to " + server.ip + " successfully.");
            } else {
                console.error("Failed to send close picture request to " + server.ip + ". Status code: " + response.status);
            }
        })
        .catch(error => {
            console.error("Error sending close picture request to " + server.ip + ": " + error);
        });
    });
}