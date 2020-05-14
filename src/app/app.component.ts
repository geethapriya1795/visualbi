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
  noResults;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.showSong = true; //change to true geethu
    this.noResults = false;
    this.getSongList();
    this.getAlbumList();
    this.fullSongList =[];
    this.songList = []
    this.fullSongList = [];
    this.albumList = [];
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
      name : 'PlayList '+num,
      createdOn : new Date(),
      songs:[]
    };
    this.playlistList.push(newPlaylist);
    localStorage.setItem("playlistList",JSON.stringify(this.playlistList))
  }

  playlistClick(list){

    this.hideDiv(document.getElementsByClassName("playlistDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistDetailDiv") , "block");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "block");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "block";
    document.getElementById("backToPlaylistSongButton").style.display = "none";
    document.getElementById("searchInput").style.display = "none";

    this.currentPlaylist = list;
    this.currentPlaylist.songs = this.sortSongs(list.songs);
    
  }

  backClick() {
    this.hideDiv(document.getElementsByClassName("playlistDiv") , "block");
    this.hideDiv(document.getElementsByClassName("playlistDetailDiv") , "none");
    // this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
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
    document.getElementById("addButton").style.display = "none";
    document.getElementById("shuffleButton").style.display = "none";
    document.getElementById("searchInput").style.display = "block";
  }

  backtoPlaylistSong() {
    this.clearSearch();
    this.hideDiv(document.getElementsByClassName("playlistDiv") , "none");
    this.hideDiv(document.getElementsByClassName("playlistSongDiv") , "block");
    this.hideDiv(document.getElementsByClassName("addSongDiv") , "none");
    document.getElementById("createButton").style.display = "none";
    document.getElementById("backButton").style.display = "block";
    document.getElementById("backToPlaylistSongButton").style.display = "none";
    document.getElementById("addButton").style.display = "block";
    document.getElementById("shuffleButton").style.display = "block";
    document.getElementById("searchInput").style.display = "none";
  }

  addSongToPlaylist(song) {
    song['createdOn'] = new Date();
    let currentSong = this.currentPlaylist.songs;
    currentSong.push(song);
    this.currentPlaylist.songs = this.sortSongs(currentSong);
    this.updateLocalStorage(currentSong, 'songs');
  }

  updateLocalStorage(record, property) {
    let storageArray = JSON.parse(localStorage.getItem("playlistList"));
    storageArray.map((data) => {
      if(data.id == this.currentPlaylist.id)
        data[property] = record;
    });
    localStorage.setItem("playlistList",JSON.stringify(storageArray));
  }

  deleteSong(song) {
    let currentSong = this.currentPlaylist.songs;
    currentSong.forEach((data,index)  => {
      if(data.id == song.id) {
        currentSong.splice(index, 1);
      }
    });
    console.log(this.currentPlaylist.songs)
    this.updateLocalStorage(currentSong , 'songs')

  }

  checkSongId(id) {
    let ans = this.currentPlaylist.songs.find((song) => song.id == id);
    return ans ? true : false;
  }

  hideDiv(divsToHide , visibility){
    for(var i = 0; i < divsToHide.length; i++)
      { divsToHide[i].style.display=visibility;}
  }

  shuffleSong() {
    this.currentPlaylist.songs = this.shuffle(this.currentPlaylist.songs);
  }

  searchSong(event) {
    let key = event.target.value;
    let data = this.fullSongList.filter((song) => this.strMatch(song.title , key) );
    this.songList = data;
    data.length ? this.noResults = false : this.noResults = true ;
  }

  clearSearch(){
    document.getElementById("searchInput").value = "";
    this.songList = this.fullSongList;
    this.noResults = false;
  }

  sortSongs (songs) {
    const sortedSong = songs.sort((a, b) => {
      let aDate = new Date(a.createdOn);
      let bDate = new Date(b.createdOn);
      return (bDate - aDate);
    })
    return sortedSong;
  }

  shuffle(songs) {
    let shuffledSongs = songs.sort(() => Math.random() - 0.5);
    return shuffledSongs;
  }

  sort(arr){
    arr.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
    return arr;
  }

  strMatch(str1: string, str2: string) {
      return (str1).toLowerCase().includes((str2).toLowerCase());
  }

  checkPlaylistExist(name) {
    if(this.strMatch(name, this.currentPlaylist.name)) {
      return false;
    } else {
      let ans = this.playlistList.find((data) => this.strMatch(data.name, name));
      console.log(ans)
      return ans ? true : false;
    }
    
  }

  edit() {
    this.hideDiv(document.getElementsByClassName("playlistName") , "block");
    this.hideDiv(document.getElementsByClassName("playlistSave") , "block");
    this.hideDiv(document.getElementsByClassName("playlistEdit") , "none");
    document.getElementById("nameLabel").style.display = "none";
    document.getElementById("playlistName").value = this.currentPlaylist.name;
  }

  save() {
    let playlistName = document.getElementById("playlistName").value;
    if(!playlistName) {
      alert("Please enter valid name");
    } else if(this.checkPlaylistExist(playlistName)) {
      alert("Playlist already exist");
    } else {
      this.hideDiv(document.getElementsByClassName("playlistName") , "none");
      this.hideDiv(document.getElementsByClassName("playlistSave") , "none");
      this.hideDiv(document.getElementsByClassName("playlistEdit") , "block");
      document.getElementById("nameLabel").style.display = "block";
      this.currentPlaylist.name = playlistName;
      this.updateLocalStorage(playlistName , 'name');
    }
    
  }

}
