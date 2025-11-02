<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const revenueData = ref([]);

const fetchRevenueData = async () => {
  try {
    const response = await fetch('https://json-server-pied-seven.vercel.app/api/revenue')
    const data = await response.json();

    revenueData.value = data.map((item) => ({
      month: item.month, 
      revenue: item.revenue, 
    }));
    initChart();
  } catch (error) {
    console.error("خطا در دریافت داده‌های درآمد:", error);
  }
};

const initChart = () => {
  const chartDom = document.getElementById("revenueChart");
  if (!chartDom) return;

  const myChart = echarts.init(chartDom);
  myChart.setOption({
    // {
    // title: {
    //   text: "درآمد ماهانه",
    //   left: "center",
    //   textStyle: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: '#FF5A5F' 
    //   }
    // },
    tooltip: {
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      }
    },
    xAxis: {
      type: "category",
      data: revenueData.value.map((item) => item.month), 
      axisLine: {
        lineStyle: {
          color: '#D1D5DB'
        }
      },
      axisLabel: {
        color: '#4B5563'
      }
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#4B5563'
      }
    },
    series: [
      {
        data: revenueData.value.map((item) => item.revenue), 
        type: "line",
        smooth: true,
        itemStyle: {
          color: '#484848'
        },
        lineStyle: {
          width: 3,
          color: '#767676'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(118, 118, 118, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(72, 72, 72, 0.05)'
            }]
          }
        }
      },
    ],
  });
};

onMounted(() => {
  fetchRevenueData();
});
</script>

<template>
  <div class="bg-white p-4 shadow-md ">
    <div id="revenueChart" style="width: 100%; height: 300px "></div>
  </div>
</template>
