<script setup lang='ts'>
import imageSrc from '@/assets/2.jpeg'
import paymentSrc from '@/assets/payment.jpeg'


</script>

<template>
  <!--  <NSpin :show="loading"> -->
  <div class="p-4 space-y-4">
    <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700 " >
      <p style="text-indent: 2em">
				此项目目前免费提供服务，服务器和接口费用昂贵，如果您觉得对您有所帮助，欢迎捐赠适额资金， 您的捐助将会为项目的长期运行提供保障，也是我们坚持开发的动力。 我们未来可能会引入更高级的技术模型或者设定高级技术模型收费制度， 届时将优先为捐赠者提供福利。请在捐款时填写备注信息，我们承诺您的个人信息仅用于内部统。
      </p>
			<p style="text-align: center;font-size: large;color:red">
			您的每一分捐助，都将是本项目持续运行和更新的动力
			</p>
      <!-- 或者使用 import 引入图片 -->
			<div style="float: left;display: flex;margin-top: 20px;">
      <img
        :src="imageSrc" alt="Image" style="width: 200px; height: 300px;margin-left: 50px"
      >
			<img
				:src="paymentSrc" alt="Image" style="width: 200px; height: 300px;margin-left: 50px"
			>
		</div>

    </div>
  </div>
</template>
