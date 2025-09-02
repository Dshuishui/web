import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getFunctionsByNamespace } from '@/api/fission';

// 函数接口 - 根据真实API返回值定义
export interface FunctionItem {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    creationTimestamp: string;
    generation: number;
    resourceVersion: string;
    uid: string;
  };
  spec: {
    concurrency: number;
    environment: {
      name: string;
      namespace: string;
    };
    functionTimeout: number;
    idletimeout: number;
    package: {
      functionName: string;
      packageref: {
        name: string;
        namespace: string;
        resourceversion: string;
      };
    };
    requestsPerPod: number;
    resources: Record<string, any>;
    InvokeStrategy: {
      StrategyType: string;
      ExecutionStrategy: {
        ExecutorType: string;
        MaxScale: number;
        MinScale: number;
        SpecializationTimeout: number;
        TargetCPUPercent: number;
      };
    };
  };
}

// API响应接口
export interface FunctionListResponse {
  apiVersion: string;
  items: FunctionItem[];
  kind: string;
  metadata: {
    continue: string;
    resourceVersion: string;
  };
}

export function useNamespace() {
  // 简化的命名空间列表，只用于选择器
  const namespaces = ref([
    { name: "topic3-pro" },
    { name: "topic3-dev" },
    { name: "development" }
  ]);
  
  const functions = ref<FunctionItem[]>([]);
  const selectedNamespace = ref<string>('topic3-pro'); // 默认选择第一个
  const functionsLoading = ref<boolean>(false);

  // 初始化时获取默认命名空间的函数
  const initializeNamespace = async () => {
    if (selectedNamespace.value) {
      await fetchFunctionsByNamespace(selectedNamespace.value);
    }
  };

  // 根据命名空间获取函数
  const fetchFunctionsByNamespace = async (namespace: string) => {
    if (!namespace) return;
    
    try {
      functionsLoading.value = true;
      console.log(`正在获取命名空间 "${namespace}" 下的函数...`);
      
      // 调用真实API获取函数数据
      const response = await getFunctionsByNamespace(namespace);
      console.log('API返回数据:', response);
      
      if (response && response.items) {
        // 将API返回的数据转换为我们的函数列表
        functions.value = response.items;
        console.log(`命名空间 "${namespace}" 下的函数获取成功，共 ${response.items.length} 个函数`);
      } else {
        // 如果API返回的数据结构不符合预期，使用空数组
        functions.value = [];
        console.log(`命名空间 "${namespace}" 下没有找到函数或数据结构异常`);
      }
      
    } catch (error) {
      console.error('获取函数列表失败:', error);
      ElMessage.error('获取函数列表失败');
      // 出错时清空函数列表
      functions.value = [];
    } finally {
      functionsLoading.value = false;
    }
  };

  // 切换命名空间
  const changeNamespace = async (namespace: string) => {
    if (!namespace) return;
    
    console.log(`切换命名空间: ${selectedNamespace.value} -> ${namespace}`);
    
    try {
      // 清空之前的函数数据
      functions.value = [];
      
      // 更新选中的命名空间
      selectedNamespace.value = namespace;
      
      // 获取新命名空间下的函数
      await fetchFunctionsByNamespace(namespace);
      
      // 显示成功消息
      ElMessage.success(`已切换到命名空间: ${namespace}`);
      
    } catch (error) {
      console.error('切换命名空间失败:', error);
      ElMessage.error(`切换命名空间失败: ${error}`);
    }
  };

  // 页面加载时初始化
  onMounted(() => {
    console.log('useNamespace Hook mounted, 开始初始化...');
    initializeNamespace();
  });

  return {
    namespaces,
    functions,
    selectedNamespace,
    functionsLoading,
    fetchFunctionsByNamespace,
    changeNamespace,
  };
}
