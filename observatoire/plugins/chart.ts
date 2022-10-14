import Vue from "vue";
import { Line, Bar, Doughnut } from "vue-chartjs/legacy";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ChartDataLabels,
);

Vue.component("line-chart", {
  extends: Line,
});
Vue.component("bar-chart", {
  extends: Bar,
});
Vue.component("doughnut-chart", {
  extends: Doughnut,
});
