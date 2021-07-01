<template>
  <div class="login-logo">
   <img :src=pic class="icon"  alt="">
   <div class="rain" v-for="item in rains" v-bind:key="item.id" :style="{ 'top' :item.top+'px', 'left':item.left+'px',  'opacity':item.opacity }"></div>
  </div>
</template>

<script>
 import img from "../assets/img/swiper/ava1.png"
export default {
  name: 'login-logo',

  data(){
    return{
      pic:img,
      rains:[],
      index:1,
      timer:null
    }
  },
  methods:{
    createRain(){
      let rain = {id:this.index,left:Math.random() * 518,opacity:parseInt(Math.random() * 10) / 10,top:-100};
      this.index +=1
      this.rains.push(rain)
       let k = 10;
       let that = this
      let rain_timer = setInterval(
            function () {
                let height = parseFloat(rain.top);
                // console.log(height);
                // console.log(rain.id+":"+k)
                k++;
                let now_height =5 * Math.pow(k / 4, 2) - 100;
                rain.top=now_height
                if (now_height >= 750) {
                    clearInterval(rain_timer);
                     that.rains.splice(that.rains.indexOf(rain),1);
                }

            }, 4); //每10秒雨滴下落一次
    }
  },
  mounted(){


     this.timer= setInterval(this.createRain, 16); //每10秒生成一滴雨

  },
  beforeDestroy(){
			clearInterval(this.timer)
		}
}
</script>

<style lang="scss" scoped>
@import '../assets/css/login-logo.scss';
</style>
