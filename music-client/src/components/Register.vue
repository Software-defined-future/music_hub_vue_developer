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
   <img :src="attachImageUrl('/a-soul/嘉然4.0.png')" class="icon"  alt="">
  </div>
</template>

<script>
import mixin from '../mixins'
export default {
  name: 'login-logo',
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import '../assets/css/register.scss';
</style>
