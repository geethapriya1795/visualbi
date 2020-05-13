import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  showSong:boolean;
  fullSongList;
  songList;
  albumList;
  playlistList;
  currentPlaylist;
  currentPlaylistSong;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.showSong = false; //change to true geethu
    // this.getSongList();
    // this.getAlbumList();
    this.fullSongList =[];
    this.songList =[
      {
        "albumId": 1,
        "id": 1,
        "title": "accusamus beatae ad facilis cum similique qui sunt",
        "url": "https://via.placeholder.com/600/92c952",
        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
      },
      {
        "albumId": 1,
        "id": 2,
        "title": "reprehenderit est deserunt velit ipsam",
        "url": "https://via.placeholder.com/600/771796",
        "thumbnailUrl": "https://via.placeholder.com/150/771796"
      },
      {
        "albumId": 1,
        "id": 3,
        "title": "officia porro iure quia iusto qui ipsa ut modi",
        "url": "https://via.placeholder.com/600/24f355",
        "thumbnailUrl": "https://via.placeholder.com/150/24f355"
      },
      {
        "albumId": 1,
        "id": 4,
        "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
        "url": "https://via.placeholder.com/600/d32776",
        "thumbnailUrl": "https://via.placeholder.com/150/d32776"
      },
      {
        "albumId": 1,
        "id": 5,
        "title": "natus nisi omnis corporis facere molestiae rerum in",
        "url": "https://via.placeholder.com/600/f66b97",
        "thumbnailUrl": "https://via.placeholder.com/150/f66b97"
      }];
    this.albumList = [
      {
        "userId": 1,
        "id": 1,
        "title": "quidem molestiae enim"
      }];
    this.playlistList = JSON.parse(localStorage.getItem("playlistList") || "[]");
    this.currentPlaylist = {id: null, name: null, createdOn: null, songs: []};
  }

  getSongList(){
    this.http.get("https://jsonplaceholder.typicode.com/photos")
    .subscribe((data) => {
      this.fullSongList = data;
      this.songList = data; });
  }

  getAlbumList(){
    this.http.get("https://jsonplaceholder.typicode.com/albums")
    .subscribe((data) => this.albumList = data);
  }

  getAlbum(albumId){
    let album = this.albumList.find((album)=> album.id == albumId)
    return album.title;
  }

  createPlaylist() {
    let playlist = JSON.parse(localStorage.getItem("playlistList") || "[]");
    let num;
    if(Array.isArray(playlist) && playlist.length) {
      let sortedList = this.sort(playlist);
      let lastObj = sortedList[sortedList.length - 1];
      num = lastObj.id + 1;
    } else {
      num = 1;
    }
    let newPlaylist = {
      id : num,
      name : 'playList'+num,
      createdOn : new Date(),
      songs:[]
    };
    this.playlistList.push(newPlaylist);
    localStorage.setItem("playlistList",JSON.stringify(this.playlistList))
  }

  playlistClick(list){

    this.hideDiv(document.getElementsByClassName("playlistDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "block");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "block";
    document.getElementById("backToPlaylistSongButton").style.display = "none";

    this.currentPlaylist = list;
    // this.currentPlaylistSong = list.song;
    
  }

  backClick() {
    this.hideDiv(document.getElementsByClassName("playlistDiv") , "block");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "none");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
    document.getElementById("createButton").style.display = "block";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("backToPlaylistSongButton").style.display = "none";
  }

  addSong() {
    this.hideDiv(document.getElementsByClassName("playlistDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "none");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "block");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("backToPlaylistSongButton").style.display = "block";
  }

  backtoPlaylistSong() {
    this.hideDiv(document.getElementsByClassName("playlistDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "block");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "block";
    document.getElementById("backToPlaylistSongButton").style.display = "none";
  }
  
  addSongToPlaylist(song) {
    song['createdOn'] = new Date();
    let currentSong = this.currentPlaylist.songs;
    currentSong.push(song);
    this.currentPlaylist.songs = currentSong;
    let storageArray = JSON.parse(localStorage.getItem("playlistList"));
    storageArray.map((data) => {
      if(data.id == this.currentPlaylist.id)
        data.songs = currentSong;
    });
    localStorage.setItem("playlistList",JSON.stringify(storageArray));
  }

  hideDiv(divsToHide , visibility){
    for(var i = 0; i < divsToHide.length; i++)
      { divsToHide[i].style.display=visibility;}
  }

  searchSong(event) {
    let key = event.target.value;
    let data = this.fullSongList.filter((song) => this.strMatch(song.title , key) );
    this.songList = data;
  }

  sort(arr){
    arr.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
    return arr;
  }

  strMatch(str1: string, str2: string) {
      return (str1).toLowerCase().includes((str2).toLowerCase());
    }

}
