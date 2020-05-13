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

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.showSong = true;
    this.getSongList();
    this.getAlbumList();
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

  searchSong(event) {
    let key = event.target.value;
    let data = this.fullSongList.filter((song) => this.strMatch(song.title , key) );
    this.songList = data;

  }

  strMatch(str1: string, str2: string) {
      return (str1).toLowerCase().includes((str2).toLowerCase());
    }

}
