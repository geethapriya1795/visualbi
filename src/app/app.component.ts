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
    this.songList =[];
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
    this.currentPlaylist = list;
    this.currentPlaylistSong = list.song;
    document.getElementById("playlistColumn").style.display = "none";
    // this.hideDiv(document.getElementsByClassName("playlistDiv") , "hidden");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "visible");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "block";
  }

  backClick() {
    // this.hideDiv(document.getElementsByClassName("playlistDiv") , "visible");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "hidden");
    document.getElementById("createButton").style.display = "block";
    document.getElementById("playlistColumn").style.display = "block";
    document.getElementById("backButton").style.display = "none";
  }

  hideDiv(divsToHide , visibility){
    for(var i = 0; i < divsToHide.length; i++)
      { divsToHide[i].style.visibility=visibility;}
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
