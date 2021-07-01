<template>
  <div class="container">
    <!-- 云盘名字等信息 -->
    <div class="title">
      <h1 style="color:#59d5f8; cursor: pointer;padding-right:20px;">
        我的云盘
      </h1>
      <span>云盘容量</span>
      <div class="bar">
        <div class="now"></div>
      </div>
      <span>{{ calculateMemory }}</span>
      <span>/</span>
      <span>60G</span>
      <el-popover
        placement="bottom-start"
        title="扩容要求"
        trigger="hover"
        width="200"
        content="B站关注：嘉然今天吃什么"
      >
        <div
          slot="reference"
          style="color:#fc3b3d; font-size:12px;cursor: pointer;padding-left:50px;"
        >
          扩容
        </div>
      </el-popover>
    </div>
    <!-- 云盘的功能按钮 -->
    <div class="func">
      <div class="add" @click.stop="uploadBoxVisible = true">上传歌曲</div>
      <div class="delete" @click.stop="delVisible = true">批量删除</div>
      <div class="refresh" @click.stop="refreshSongs">刷新</div>
    </div>
    <!-- 云盘的歌曲列表 -->

    <el-table
      v-if="songList.length"
      :data="songList"
      style=" width: 100%;cursor: pointer;"
      height="630"
      :cell-style="imgCell"
      :default-sort="{ prop: 'upload_time', order: 'descending' }"
      @row-click="clickTableRow"
      @row-contextmenu="rightClick"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" min-width="5%"></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        min-width="5%"
      ></el-table-column>
      <el-table-column align="center" label="图片" min-width="5%">
        <template slot-scope="scope">
          <img
            :src="getUrl(scope.row.pic)"
            alt=""
            style="width: 45px; height:45px border-radius:5px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        sortable
        label="歌曲名"
        min-width="20%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="name"
        sortable
        label="艺人"
        min-width="10%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="intro"
        label="专辑"
        min-width="20%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="format"
        label="格式"
        min-width="5%"
        :filters="[
          { text: 'MP3', value: 'MP3' },
          { text: 'WMA', value: 'WMA' },
          { text: 'WAV', value: 'WAV' }
        ]"
        :filter-method="filterFormat"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            type=""
            v-if="scope.row.format === 'MP3'"
            disable-transitions
            effect="dark"
            >{{ scope.row.format }}</el-tag
          >
          <el-tag
            type="success"
            v-if="scope.row.format === 'WMA'"
            disable-transitions
            effect="dark"
            >{{ scope.row.format }}</el-tag
          >
          <el-tag
            type="info"
            v-if="scope.row.format === 'WAV'"
            disable-transitions
            effect="dark"
            >{{ scope.row.format }}</el-tag
          >
          <!-- <el-tag
          type='danger'
          disable-transitions effect="dark">{{scope.row.format}}</el-tag>
                  <el-tag
          type='warning'
          disable-transitions effect="dark">{{scope.row.format}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        sortable
        label="大小"
        min-width="5%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        sortable
        prop="upload_time"
        label="上传时间"
        min-width="10%"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <!-- 云盘里没有一首歌曲 -->
    <div v-else class="no-song">
      <div class="txt1">超大空间，永久保存</div>
      <div class="txt">B站关注：嘉然今天吃什么</div>
      <div class="txt3">
        关注嘉然，顿顿解馋<br />
        买不了吃亏，买不了上当！<br />
        吃麻麻香~身体倍棒！！！<br />
        一口气上五楼不喘气！！！
      </div>
      <div class="add" @click.stop="uploadBoxVisible = true">立即上传歌曲</div>
    </div>
    <div class="fun-bg" @click.stop="bgClick">
      <div class="fun-container">
        <!-- 右键菜单 -->
        <div
          class="fun"
          v-for="(item, index) in funs"
          :key="index"
          @click.stop="infoClick(index)"
        >
          <div class="fun-name">{{ item }}</div>
        </div>
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
    <!-- 歌曲上传 -->

    <el-dialog title="音乐上传" center :visible.sync="uploadBoxVisible">
      <el-upload
        class="upload"
        ref="upload"
        name="music"
        :action="uploadUrl()"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        accept=".mp3"
        :limit="15"
        multiple
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button size="small" type="success" @click.stop="submitUpload"
          >一键上传</el-button
        >
        <div slot="tip" class="el-upload__tip">只能上传MP3文件</div>
        <div slot="tip" class="file_list_txt">要上传的文件列表如下：</div>
      </el-upload>
    </el-dialog>
    <!-- 文件信息修改 -->
    <el-dialog title="信息修改" :visible.sync="musicInfoVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="图片" prop="pic">
          <el-upload
            ref="imgUpload"
            name="img"
            :class="{ disable: uploadDisabled() }"
            :action="alterFormURL()"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :data="form"
          >
            <i class="el-icon-plus"></i>
            <!-- <el-image style="width: 146px; height: 146px" fit="fill" :src="form.pic"></el-image> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="歌曲名" prop="title">
          <el-input v-model="form.title" placeholder="请输入歌曲名"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="name">
          <el-input v-model="form.name" placeholder="请输入歌手"></el-input>
        </el-form-item>
        <el-form-item label="所属专辑" prop="intro">
          <el-input
            v-model="form.intro"
            placeholder="请输入所属专辑"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="musicInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo">修 改</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="删除提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt" align="center">
        删除不可恢复，是否确定删除？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delSong">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "../mixins";
import { getSize, getCloudSongs, download, updateCloudSong } from "../api";

export default {
  name: "my-cloud",
  mixins: [mixin],
  data() {
    return {
      calculateMemory: "",
      row: {},
      multipleSelection: [],
      form: {
        pic: "",
        title: "",
        name: "",
        intro: ""
      },
      musicInfoVisible: false,
      uploadBoxVisible: false,
      delVisible: false,
      funs: ["修改信息", "上传歌词", "下载歌曲", "删除歌曲"],
      songList: [
       
      ],

      // currentPage: 1,
      // pageSize: 10,
      rules: {
        title: [{ required: true, message: "请输入歌曲名", trigger: "blur" }],
        name: [{ required: true, message: "请输入歌手", trigger: "blur" }],
        intro: [{ required: true, message: "请输入所属专辑", trigger: "blur" }]
      }
    };
  },

  methods: {
    refreshSongs() {
      let _this = this;
      getCloudSongs(this.userId)
        .then(res => {
          _this.songList = res;
        })
        .catch(res => {
          console.log(err);
        });
      this.$message({
        message: "歌曲刷新成功",
        type: "success"
      });
    },
    // 删除一首歌曲
    deleteRow(songId) {
      deleteCollection(this.$route.query.id, songId)
        .then(res => {
          if (res) {
            this.getData();
            this.notify("删除成功", "success");
          } else {
            this.notify("删除失败", "error");
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.delVisible = false;
    },

    // 获取批量要删除的列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //计算容量
    calculateMemoryMe() {
      let len = "0.0G";
      if (this.usedMemory < 1024) {
        len = (this.usedMemory * 1.0).toFixed(1) + "B";
      } else if (this.usedMemory < 1048576) {
        len = ((this.usedMemory * 1.0) / 1024).toFixed(1) + "KB";
      } else if (this.usedMemory < 1073741824) {
        len = ((this.usedMemory * 1.0) / 1048576).toFixed(1) + "MB";
      } else {
        len = ((this.usedMemory * 1.0) / 1048576).toFixed(1) + "GB";
      }
      this.updateBar(this.usedMemory);
      this.calculateMemory = len;
    },
    // 隐藏图片上传按钮
    uploadDisabled() {
      // console.log(this.$refs.imgUpload)

      return false;
      // return this.$refs.upload.uploadFiles.length > 0   //判断图片上传的数量动态控制按钮隐藏与显示
    },
    alterFormURL() {
      return `${this.$store.state.configure.HOST}/cloud/updateInfo?userId=${this.userId}`;
    },
    submitInfo() {
       let vm = this;
      if(this.$refs.imgUpload.uploadFiles.length === 0){
        // console.log("文件为0")
  this.$refs["form"].validate(valid => {
        if (valid) {
           let params = new URLSearchParams()
      params.append('userId', vm.userId)
      params.append('id',vm.row.id)
      params.append('name', vm.form.name)
      params.append('intro', vm.form.intro)
      params.append('title', vm.form.title)
        
         updateCloudSong(params);
        } else {
          return false;
        }
      })
      }else {
          // console.log("文件为1")
     
      this.$refs["form"].validate(valid => {
        if (valid) {
          vm.$refs.imgUpload.submit();
          //  console.log(123)
        } else {
          return false;
        }
      });
      }


      this.musicInfoVisible = false;
    },
    uploadUrl() {
      // return `${this.$store.state.configure.HOST}/cloud/upload?id=${this.userId}`

      return `${this.$store.state.configure.HOST}/cloud/upload?id=1`;
    },
    updateBar(len) {
      const total = 515396075520;

      let bar = document.querySelector(".now");
      bar.style.width = `${len / total}%`;
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$message.error(`${response.message}`);
        this.$store.commit("setUsedMemory", this.usedMemory - file.size);
      } else if (response.code === 1) {
     

        this.$message({
          type: "success",
          message: `${file.name}文Y件上传成功`
        });
        this.calculateMemoryMe();
      }
    },
    uploadError(error, file, fileList) {
      // console.log(file);
      this.$store.commit("setUsedMemory", this.usedMemory - file.size);
      this.$message.error(`${file.name}上传失败`);
    },
    submitUpload() {
      //  console.log(`${this.$store.state.configure.HOST}/cloud/upload`);
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error(`请选择要上传的文件`);
      } else {
        let _this = this;
        this.$confirm("是否上传这些文件？")
          .then(() => {
            setTimeout(function() {
              _this.$refs.upload.submit();
            }, 400);
          })
          .catch(() => {
            console.log("取消上传");
          });
      }
    },
    beforeUpload(file) {
      console.log(file);
      const isMP3 = file.type === "audio/mpeg";

      if (!isMP3) {
        this.$message.error("上传文件只能是Mp3格式!");
        return false;
      }
      // this.usedMemory = this.usedMemory+file.size;
      this.$store.commit("setUsedMemory", this.usedMemory + file.size);

      if (this.total < this.usedMemory) {
        this.$message.error("云盘空间不够!");
        return false;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    bgClick() {
      var bg = document.querySelector(".fun-bg");
      bg.style.display = "none";
    },
    infoClick(index) {
      //        this.menus[index]
      var bg = document.querySelector(".fun-bg");
      bg.style.display = "none";
      if (this.funs[index] === "修改信息") {
        this.musicInfoVisible = true;
      } else if (this.funs[index] === "上传歌词") {
        this.$alert("不关注嘉然的人有难了！！！", "功能正在实现中", {
          confirmButtonText: "确定"
        });
      } else if (this.funs[index] === "下载歌曲") {
        download(this.$store.state.configure.HOST + this.row.url)
          .then(res => {
            let content = res.data;
            let eleLink = document.createElement("a");
            eleLink.download = `${this.row.name}-${this.row.title}.mp3`;
            eleLink.style.display = "none";
            // 字符内容转变成blob地址
            let blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (this.funs[index] === "删除歌曲") {
        this.$alert("不关注嘉然的人有难了！！！", "功能正在实现中", {
          confirmButtonText: "确定"
        });
      }
    },

    filterFormat(value, row) {
      return row.format === value;
    },

    // // 获取当前页
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    // },
    imgCell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return { padding: 0 };
      }
    },
    // 播放
    toplay: function(id, url, pic, index, title, name, lyric) {
      this.$store.commit("setIsPlay", false);
      this.$store.commit("setId", id);
      this.$store.commit("setListIndex", index); //在播放列表的位置
      this.$store.commit("setUrl", this.$store.state.configure.HOST + url);
      this.$store.commit("setpicUrl", this.$store.state.configure.HOST + pic);
      this.$store.commit("setTitle", title);
      this.$store.commit("setArtist", name);
      this.$store.commit("setLyric", this.parseLyric(lyric));
    },
    clickTableRow(row, column, event) {
      this.toplay(
        row.id,
        row.url,
        row.pic,
        row.index,
        row.title,
        row.name,
        row.lyric
      );
    },
    rightClick(row, column, event) {
      event.preventDefault();
      var bg = document.querySelector(".fun-bg");

      //获取我们自定义的右键菜单
      var menu = document.querySelector(".fun-container ");

      // 根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = event.clientX + "px";
      menu.style.top = event.clientY + "px";
      // 改变自定义菜单的隐藏与显示
      bg.style.display = "block";
      this.row = row;
    },
    //获取当前的行数
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = this.songList.indexOf(row);
      // console.log(row)
    },

    //删除歌曲
    delSong() {
      for (let item of this.multipleSelection) {
        this.deleteRow(item.id);
      }
      this.multipleSelection = [];
    }
  },
  computed: {
    ...mapGetters(["userId", "usedMemory"])
  },
  mounted() {
    let _this = this;

    getCloudSongs(this.userId)
      .then(res => {
        _this.songList = res;
        this.$store.commit("setListOfSongs", _this.songList);
      })
      .catch(res => {
        console.log(err);
      });
    _this.calculateMemoryMe();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/my-cloud.scss";
</style>
