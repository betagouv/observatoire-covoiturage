import Vue from "vue";
import { Line, Bar } from "vue-chartjs/legacy";
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
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
);

Vue.component("line-chart", {
  extends: Line,
});
Vue.component("bar-chart", {
  extends: Bar,
});
