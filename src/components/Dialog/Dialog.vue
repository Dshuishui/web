<script setup lang="ts">
import { ElDialog } from 'element-plus';
import CustomBtn from '@/components/CustomBtn/CustomBtn.vue';


const props = defineProps<{ title: string, width?: string, top?: string }>();
const openModel = defineModel('open');
const emits = defineEmits<{ confirm: [] }>();
</script>

<template>
    <ElDialog v-model="openModel" :modal="false" :width="props.width ?? ''" :top="props.top ?? ''" :append-to-body="true"
        class="common-dialog">
        <div class="common-dialog-content">
            <slot></slot>
        </div>
        <template #header>
            <span class="header">{{ props.title }}</span>
        </template>
        <template #footer>
            <div class="buttons">
                <CustomBtn plain @click="openModel = false">
                    <template #text>取消</template>
                </CustomBtn>
                <CustomBtn :btn-style="{ marginLeft: '20px' }" @click="() => { emits('confirm'); }">
                    <template #text>确定</template>
                </CustomBtn>
            </div>
        </template>
    </ElDialog>
</template>

<style scoped lang="less"></style>
<style  lang="less">
.common-dialog {
    padding: 20px;

    & .common-dialog-content {
        text-align: left;
        text-transform: none;
        color: #606266;
        font-family: PingFangSC, PingFang SC;
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        line-height: 22px;
    }

    & .el-dialog__header[class~="el-dialog__header"] {
        padding-bottom: 20px;
    }

    & .el-dialog__footer {
        padding-top: 20px;
    }

    & .header {
        text-align: left;
        text-transform: none;
        color: #303133;
        font-family: PingFangSC, PingFang SC;
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        line-height: 26px;
    }

    & .buttons {
        display: flex;
        justify-content: center;
        width: 100%;
    }
}
</style>
