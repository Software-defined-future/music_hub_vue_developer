<template>
    <div class="container">
        <!-- 云盘名字等信息 -->
        <div class="title">
            <h1 style="color:#59d5f8; cursor: pointer;padding-right:20px;">我的云盘</h1>
            <span>云盘容量</span>
            <div class="bar">
                <div class="now"></div>
            </div>
            <span>30.0G</span>
            <span>/</span>
            <span>60G</span>

            <div style="color:#fc3b3d; font-size:12px;cursor: pointer;padding-left:50px;">扩容</div>
        </div>
        <!-- 云盘的功能按钮 -->
        <div class="func">
            <div class="add" @click.stop="uploadSong">上传歌曲</div>
            <div class="delete"  @click.stop="delSong">批量删除</div>
        </div>
        <!-- 云盘的歌曲列表 -->

    <el-table v-if="songList.length>20"  :data="songList" style=" width: 100%;cursor: pointer;" height="630" :cell-style="imgCell"
     :default-sort = "{prop: 'time', order: 'descending'}"
      @row-click="clickTableRow"
       @row-contextmenu="rightClick"
       :row-class-name="rowClassName">
    
        <el-table-column type="selection" min-width="5%"></el-table-column>
        <el-table-column type="index" label="序号" min-width="5%"></el-table-column>
        <el-table-column align="center" label="图片" min-width="5%" >
               <template slot-scope="scope">
            <img :src="getUrl(scope.row.pic)" alt="" style="width: 45px; height:45px border-radius:5px"/>

          </template>
        </el-table-column>
        <el-table-column prop="title"   sortable label="歌曲名" min-width="20%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name"   sortable label="艺人" min-width="10%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="intro" label="专辑" min-width="20%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="format" label="格式" min-width="5%"   :filters="[{ text: 'MP3', value: 'MP3' }, { text: 'WMA', value: 'WMA' }, { text: 'WAV', value: 'WAV' }]" :filter-method="filterFormat" filter-placement="bottom-end">
             <template slot-scope="scope">
        <el-tag
          type='' v-if="scope.row.format==='MP3'"
          disable-transitions effect="dark">{{scope.row.format}}</el-tag>
                  <el-tag
          type='success' v-if="scope.row.format==='WMA'"
          disable-transitions effect="dark">{{scope.row.format}}</el-tag>
                  <el-tag
          type='info' v-if="scope.row.format==='WAV'"
          disable-transitions effect="dark">{{scope.row.format}}</el-tag>
                  <!-- <el-tag
          type='danger'
          disable-transitions effect="dark">{{scope.row.format}}</el-tag>
                  <el-tag
          type='warning'
          disable-transitions effect="dark">{{scope.row.format}}</el-tag> -->
      </template>
        </el-table-column>
        <el-table-column prop="size"  sortable label="大小" min-width="5%" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="time" label="上传时间" min-width="10%" show-overflow-tooltip></el-table-column>

     </el-table>
        <!-- 云盘里没有一首歌曲 -->
    <div v-else class="no-song">
<div class="add" @click.stop="uploadSong">立即上传歌曲</div>
    </div>
  <div class="fun-bg" @click.stop="bgClick">
    <div class="fun-container">
      <!-- 右键菜单 -->
    <div class="fun" v-for="(item, index) in funs" :key="index" @click.stop="infoClick(index)">
        <div class="fun-name">{{item}}</div>
    </div>
 
   
    <!-- <div class="fun">
        <div class="fun-name">其他</div>
    </div> -->
</div>
    </div>

<!--         
           <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="songList.length"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div> -->
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "../mixins";
export default {
  name: "my-cloud",
  mixins: [mixin],
  data() {
    return {
      funs:['修改信息','下载歌曲','删除歌曲'],
      songList: [
        {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "WMA",
          size: "10M",
          time: "2021-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "WAV",
          size: "10M",
          time: "2021-03-21"
        },
               {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "WAV",
          size: "10M",
          time: "2011-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2051-03-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2021-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "WMA",
          size: "10M",
          time: "2020-03-11"
        },
               {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2011-07-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2051-03-01"
        },
              {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2021-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2021-03-21"
        },
               {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2011-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2051-03-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2021-06-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "2090-03-11"
        },
               {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "1011-07-21"
        },
            {
            pic:'img/user.jpg',
          title: "超级敏感",
          name: "A-SOUL",
          intro: "嘉然小姐的狗",
          format: "MP3",
          size: "10M",
          time: "1991-03-01"
        }
      ],
      id: 1,
      // currentPage: 1,
      // pageSize: 10,
      currentRow:0
    };
  },
  methods: {
    bgClick(){
 var bg = document.querySelector(".fun-bg");
          bg.style.display = 'none';
    },
     infoClick(index) {
//        this.menus[index]           
          var bg = document.querySelector(".fun-bg");
          bg.style.display = 'none';
               
            },

        filterFormat(value, row) {
        return row.format === value;
      },
      uploadUrl (id) {
      return `${this.$store.state.HOST}/songList/img/update?id=${id}`
    },
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    imgCell({row, column, rowIndex, columnIndex}){
        if(columnIndex===2)
        {
            return {"padding":0};
        }
    },
    clickTableRow(row, column, event){
      toplay(row.id, row.url, row.pic, row.index, row.name, row.lyric)
    },
    rightClick(row, column, event){
       event.preventDefault();
        var bg = document.querySelector(".fun-bg");
         
                //获取我们自定义的右键菜单
  var menu = document.querySelector(".fun-container ");
        
                // 根据事件对象中鼠标点击的位置，进行定位
                menu.style.left = event.clientX + 'px';
                menu.style.top = event.clientY + 'px';
                // 改变自定义菜单的隐藏与显示
                bg.style.display = 'block';


    },
    //获取当前的行数
        rowClassName({row, rowIndex}) {
          //把每一行的索引放进row
          row.index = rowIndex;
          // console.log(row)
        
        },
        //上传歌曲
        uploadSong(){

        },

        //删除歌曲
        delSong(){

        }

  },
  computed: {
    // 计算当前表格中的数据
    // tableData() {
    //   return this.songList.slice(
    //     (this.currentPage - 1) * this.pageSize,
    //     this.currentPage * this.pageSize
    //   );
    // }
  }
  //       computed: {
  //     ...mapGetters([
  //       'id' // 音乐ID
  //     ])
  //   }
};
</script>
<style lang="scss" scoped>
@import "../assets/css/my-cloud.scss";
</style>


