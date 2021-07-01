<template>
  <div>
    <div class="recommend-song">
      <div class="recommend-title">为你推荐</div>
      <div
        class="song-item"
        v-for="song in recommend_songs"
        :key="song.id"
        @click="playSong(song)"
      >
        <img width="50px" height="50px" :src="song.img" alt="" />
        <div class="song-detail">
          <div class="song-name">{{ song.name }}</div>
          <div class="singer">{{ song.singer }}</div>
        </div>
      </div>
    </div>
    <div class="song-lyric">
      <h1 class="lyric-title">歌词</h1>
      <transition-group name="lyric-fade">
        <!--有歌词-->
        <ul
          :style="{ top: lrcTop }"
          class="has-lyric"
          v-if="lyr.length"
          key="has-lyric"
        >
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
      <div
        class="list-item"
        v-for="list in container_list"
        :key="list.id"
        @click="goAblum(list)"
      >
        <img width="50px" height="50px" :src="url + list.pic" alt="" />
        <div class="list-detail">
          <div class="list-name">{{ list.title }}</div>
          <div class="score">评分：{{ list.score }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import mixin from "../mixins";
import Comment from "../components/Comment";
import { getRecomendSongs, getContainerList } from "../api/index";
import test from "../assets/img/swiper/super.png";
export default {
  name: "lyric",
  mixins: [mixin],
  components: {
    Comment
  },
  data() {
    return {
      url: "http://localhost:8888",
      lrcTop: "200px", // 歌词滑动
      showLrc: false, // 切换唱片和歌词
      lyr: [], // 当前歌曲的歌词
      recommend_songs: [
        { id: 0, img: test, name: "超级敏感", singer: "A-SOUL" }
      ],
      container_list: [{ id: 0, pic: "", title: "", score: "" }]
    };
  },
  computed: {
    ...mapGetters([
      "curTime",
      "id", // 歌曲ID
      "lyric", // 歌词
      "listOfSongs", // 存放的音乐
      "listIndex", // 当前歌曲在歌曲列表的位置
      "userId",
      "loginIn"
    ])
  },
  watch: {
    id: function() {
      this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric);
    },
    // 播放时间的开始和结束
    curTime: function() {
      // 处理歌词位置及颜色
      if (this.lyr.length !== 0) {
        for (let i = 0; i < this.lyr.length; i++) {
          if (this.curTime >= this.lyr[i][0]) {
            for (let j = 0; j < this.lyr.length; j++) {
              document.querySelectorAll(".has-lyric li")[j].style.color =
                "#000";
              document.querySelectorAll(".has-lyric li")[j].style.fontSize =
                "15px";
            }
            if (i >= 0) {
              document.querySelectorAll(".has-lyric li")[i].style.color =
                "#af7eed";
              document.querySelectorAll(".has-lyric li")[i].style.fontSize =
                "25px";
            }
          }
        }
      }
    }
  },
  created() {
    this.lyr = this.lyric ? this.lyric : [];
    //获取相似歌曲
    this.getRecomendSongs();
    //获取包含该歌曲的列表
    this.getContainerList();
  },
  methods: {
      goPlayerPage () {
      this.$router.push({path: `/lyric/${this.id}`})
    },
    playSong(item) {
      this.$store.commit("setTempList", item);
      this.$store.commit("setIsPlay", false);
      this.$store.commit("setId", item.id);
      this.$store.commit("setListIndex", 0); //在播放列表的位置
      this.$store.commit("setUrl", this.$store.state.configure.HOST + item.url);
      this.$store.commit(
        "setpicUrl",
        this.$store.state.configure.HOST + item.pic
      );
      this.$store.commit("setTitle", this.replaceFName(item.name));
      this.$store.commit("setArtist", this.replaceLName(item.name));
      this.$store.commit("setLyric", this.parseLyric(item.lyric));
      if (this.loginIn) {
        this.$store.commit("setIsActive", false);
        getCollectionOfUser(this.userId)
          .then(res => {
            for (let item of res) {
              if (item.songId === id) {
                this.$store.commit("setIsActive", true);
                break;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
     this.goPlayerPage()
    },
    goAblum(item) {
      this.$store.commit("setTempList", item);
      this.$router.push({ path: `/song-list-album/${item.id}` }).catch(err => {
        console.log(err);
      });
    },
    getRecomendSongs() {
      getRecomendSongs(this.id)
        .then(res => {
          this.recommend_songs = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getContainerList() {
      getContainerList(this.id)
        .then(res => {
          this.container_list = res;
          // console.log(res)
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/lyric.scss";
</style>
