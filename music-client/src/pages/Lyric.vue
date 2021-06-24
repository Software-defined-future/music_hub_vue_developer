<template>
<div>
  
<div class="recommend-song">
   <div class="recommend-title">相似歌曲</div>
    <div class="song-item" v-for="song in recommend_songs" :key="song.id">
      <img width="50px" height="50px" :src=song.img alt="">
        <div class="song-detail">
            <div class="song-name">{{song.name}}</div>
            <div class="singer">{{song.singer}}</div>
        </div>
    </div>
</div>
  <div class="song-lyric">
    <h1 class="lyric-title">歌词</h1>
    <transition-group name="lyric-fade">
      <!--有歌词-->
      <ul :style="{top:lrcTop}" class="has-lyric" v-if="lyr.length" key="has-lyric">
        <li v-for="(item, index) in lyr" v-bind:key="index">
          {{ item[1] }}
        </li>
      </ul>
      <!--没歌词-->
      <div v-else class="no-lyric" key="no-lyric">
        <span>暂无歌词</span>
      </div>
    </transition-group>
    <comment :playId="id" :type="0"></comment>
  </div>
  <div class="container-list">
   <div class="container-title">包含这首歌的歌单</div>
    <div class="list-item" v-for="song in recommend_songs" :key="song.id">
      <img width="50px" height="50px" :src=song.pic alt="">
        <div class="list-detail">
            <div class="list-name">{{song.title}}</div>
            <div class="score">评分：{{song.score}}</div>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from '../mixins'
import Comment from '../components/Comment'
import{getRecomendSongs, getContainerList} from '../api/index'

export default {
  name: 'lyric',
  mixins: [mixin],
  components: {
    Comment
  },
  data () {
    return {
      lrcTop: '200px', // 歌词滑动
      showLrc: false, // 切换唱片和歌词
      lyr: [], // 当前歌曲的歌词
      recommend_songs:[{id:0,img:"",name:"",singer:""}],
      container_list:[{id:0,pic:"",title:"",score:""}]
    }
  },
  computed: {
    ...mapGetters([
      'curTime',
      'id', // 歌曲ID
      'lyric', // 歌词
      'listOfSongs', // 存放的音乐
      'listIndex' // 当前歌曲在歌曲列表的位置
    ])
  },
  watch: {
    id: function () {
      this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric)
    },
    // 播放时间的开始和结束
    curTime: function () {
      // 处理歌词位置及颜色
      if (this.lyr.length !== 0) {
        for (let i = 0; i < this.lyr.length; i++) {
          if (this.curTime >= this.lyr[i][0]) {
            for (let j = 0; j < this.lyr.length; j++) {
              document.querySelectorAll('.has-lyric li')[j].style.color = '#000'
              document.querySelectorAll('.has-lyric li')[j].style.fontSize = '15px'
            }
            if (i >= 0) {
              document.querySelectorAll('.has-lyric li')[i].style.color = '#af7eed'
              document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px'
            }
          }
        }
      }
    }
  },
  created () {
    this.lyr = this.lyric ? this.lyric : []
     //获取相似歌曲
    this.getRecomendSongs()
    //获取包含该歌曲的列表
    this.getContainerList()
  },
  methods:{
    getRecomendSongs(){
      getRecomendSongs(this.id)
      .then(res => {
        this.recommend_songs = res
      }).catch(err => {
          console.log(err)
        })
    },
    getContainerList(){
      getContainerList(this.id)
      .then(res =>{
        this.container_list = res
      }).catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/lyric.scss';
</style>
