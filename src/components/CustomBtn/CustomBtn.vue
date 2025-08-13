<script setup lang="ts">
import { computed, CSSProperties } from 'vue';


const emits = defineEmits<{
    click: []
}>();
const props = withDefaults(
    defineProps<{ plain?: boolean, btnStyle?: CSSProperties, icon?: boolean }>(),
    {
        plain: false,
        icon: false
    }
);


const btnTyps = computed(() => {
    return props.plain ? 'plain__btn' : 'common__btn';
})
</script>

<template>
    <button @click="emits('click')" :class="btnTyps" :style="props.btnStyle">
        <div class="btn-info-container">
            <span v-if="props.icon" class="btn-info-container__span--icon">
                <slot name="icon"></slot>
            </span>
            <span class="btn-info-container__span" :data-btn-type="btnTyps">
                <slot name="text"></slot>
            </span>
        </div>
    </button>
</template>

<style scoped lang="less">
.base {
    box-sizing: border-box;
    padding: 5px 16px;
    border-radius: 4px;
}

.plain__btn {
    color: #666;
    border: 1px solid #DCDFE6;
    background-color: transparent;
    .base();

    &:hover {
        color: #0C8357;
        border: 1px solid #0C8357;
        background-color: rgba(78, 192, 142, 0.05);
    }
}

.common__btn {
    color: #fff;
    border: 0px;
    background: linear-gradient(270deg, #497AAE 0%, #4EC58C 100%);
    .base();

    &:hover {
        background: linear-gradient(270deg, #335F8D 0%, #3DA171 100%);
    }
}

.btn-info-container {
    display: flex;
    align-items: center;
    text-align: left;
    text-transform: none;
    color: inherit;
    font-family: PingFangSC, PingFang SC;
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
    line-height: 22px;
}

.btn-info-container__span--icon {
    display: inline-flex;
    margin-right: 6px;
}
</style>