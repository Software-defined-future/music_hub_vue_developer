<template>
  <div class="login-logo">
 	<ul class="bg-bubbles">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
   <img :src=pic class="icon"  alt="">
  </div>
</template>

<script>
import img from '../assets/img/swiper/diana1.png'
export default {
  name: 'login-logo',
    data(){
    return{
      pic:img,
   
    }
  },

}
</script>

<style lang="scss" scoped>
@import '../assets/css/register.scss';
</style>
