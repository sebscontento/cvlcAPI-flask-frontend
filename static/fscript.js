//frontscript.js

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

function showRebootOptions() {
    // Extract computer numbers from the config
    var computerNumbers = config.servers.map(server => server["Computer Number"]);

    // Reference to the dropdown
    var computerNumbersSelect = document.getElementById("computerNumbersSelect");

    // Clear existing options
    computerNumbersSelect.innerHTML = "";

    // Create option for selecting all
    var allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    computerNumbersSelect.appendChild(allOption);

    // Create options for each computer number
    computerNumbers.forEach(number => {
        var option = document.createElement("option");
        option.value = number;
        option.textContent = number;
        computerNumbersSelect.appendChild(option);
    });

    // Show the reboot options div
    document.getElementById("rebootOptions").style.display = "block";

    // Add event listener to handle selecting "All"
    computerNumbersSelect.addEventListener("change", function() {
        if (this.value === "all") {
            // Select all options except the "All" option
            Array.from(this.options).forEach(option => {
                option.selected = true;
            });
        }
    });
}




function rebootServers() {
    // Retrieve selected computer numbers
    var selectedNumbers = [];
    var computerNumbersSelect = document.getElementById("computerNumbersSelect");

    if (computerNumbersSelect.value === "all") {
        // If "All" is selected, add all computer numbers
        selectedNumbers = config.servers.map(server => server["Computer Number"]);
    } else {
        // Otherwise, add only selected options
        for (var i = 0; i < computerNumbersSelect.options.length; i++) {
            var option = computerNumbersSelect.options[i];
            if (option.selected && option.value !== "all") {
                selectedNumbers.push(option.value);
            }
        }
    }

    // Prompt for username and password
    var username = prompt("Enter your username:");
    var password = prompt("Enter your password:");

    // Construct and send reboot requests for each selected server
    selectedNumbers.forEach(number => {
        var selectedServer = config.servers.find(server => server["Computer Number"] === number);

        if (!selectedServer) {
            console.error("Invalid Computer Number selected:", number);
            return; // Skip invalid numbers
        }

        var serverUrl = selectedServer.ip + "/reboot";

        fetch(serverUrl, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Server " + number + " reboot request sent successfully.");
                // Add any additional logic here if needed
            } else {
                console.error("Failed to send server " + number + " reboot request. Status code: " + response.status);
            }
        })
        .catch(error => {
            console.error("Error sending server " + number + " reboot request:", error);
        });
    });
}
