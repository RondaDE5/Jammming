const clientID = '84ec129716e14229b1a897886e9c3d77';
const redirectURI = 'http://Ronda_Jammming.surge.sh';

let accessToken;

const Spotify = {
  getAccessToken() {
    let checkAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let checkExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken) {
      return accessToken;
    } else if (checkAccessToken !== null && checkExpiration !== null) {
        accessToken = checkAccessToken[1];
        let accessExpiration = checkExpiration[1];
        window.setTimeout(() => accessToken = '', accessExpiration * 1000);
        window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    if(!accessToken) {
      this.getAccessToken();
    }
    return fetch(url, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks){
        return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          })
        )
      } else {
        return [];
      }
    });
  },

  savePlaylist(name, tracks) {
    let defaultAccessToken = accessToken;
    let defaultHeaders = {Authorization: `Bearer ${defaultAccessToken}`};
    let userID;
    let playlistID;

    if(!name || !tracks) {
      return;

    } else {

      return fetch('https://api.spotify.com/v1/me', {headers: defaultHeaders}
      ).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.id) {
          userID = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${defaultAccessToken}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({name: name})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(jsonResponse.id) {
          playlistID = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${defaultAccessToken}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({uris: tracks})
      }).then(response => {
        return response.json();
      });
    }
  })
}
});

    }

  }

};

export default Spotify;
