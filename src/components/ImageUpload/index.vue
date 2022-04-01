<template>
<div>
<!-- action 是上传的地址 -->
<!-- uploada组件显示的是file-list -->
<!-- :http-request="upload" 能够覆盖默认的上传行为  -->
    <el-upload list-type="picture-card" :limit="1" action="#" :on-preview="preview" :file-list="fileList" :class="{disabled: fileComputed }" :on-remove="handleRemove" :on-change="changeFile" :before-upload="beforeUpload" :http-request="upload" >
     <i class="el-icon-plus" />
  </el-upload>
   <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
   <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
   </el-dialog>
</div>

</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包

var cos = new COS({
  // 需要把id和key改成自己的信息,才能上传到自己的存储桶里面
  SecretId: 'AKIDDE0XrwlLfEZfV6RWO3TeZEeojOq2zg8L', // 身份识别 ID
  SecretKey: 'zjDSRAesrc8PQCi3B3g3B3f291d1A3h5' // 身份密钥
})

export default {
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    // 如果它为true就不应该显示 +号上传了
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  // fileList 是上传的文件列表，可以绑定到上传图片上，让上传组件来显示
  data () {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: '', // 用一个变量 记住当前上传的图片id
      percent: 0, // 记录当前的百分比
      showPercent: false // 默认不显示进度条
    }
  },
  methods: {
    // 点击预览事件
    preview (file) {
    // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file) {
      // file是点击删除的文件   fileList是删过之后的文件
    // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile (file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      // 先检查文件的类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小   1MB = 1024 KB   1KB = 1024 B
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true // 最后一定要return true，认为可以继续上传
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload (params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作   上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        cos.putObject({
          Bucket: 'kderban-1310648043', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        })
      }
    }
  }

}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
