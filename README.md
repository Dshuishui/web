1、前提是使用element-plus组件库
2、引入 styles/common.less 公共样式文件
3、在使用的时候，直接用common.less中找已有的公共样式进行复用
比如在el-button组件上直接添加class="-emdc-button-primary"直接复用主按钮样式
<el-button class="-emdc-button-primary" @click="create">创建 XXXXX</el-button>
比如在el-input组件上直接添加class="common-input"生成符合主题色的输入框
<el-input class="common-input" v-model="form.reason" placeholder="请输入" type="input" />
比如自己写样式，可以直接通过var(--emdc-text-color-primary)来使用定义好的全局样式变量