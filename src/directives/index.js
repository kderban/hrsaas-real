// 负责管理所有的自定义指令

export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted (dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片

    //   图片异常的逻辑
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.src = dom.src || options.value // 初始化的时候，如果有值就赋值，没有值就进行默认值赋值。

    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.onerror = function () {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  },
  // 该函数和inserted一样，也是钩子函数
  componentUpdated (dom, options) {
    // 该钩子函数会在当前指令作用的组件，更新数据完毕之后 执行
    dom.src = dom.src || options.value
  }
}

