if (document.getElementById("bots_table")) {
  let bots_table = document.getElementById("bots_table");
  fetch("../json/bots")
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      bots_table.innerHTML = null;
      myJson.forEach((element) => {
        bots_table.innerHTML += `<tr
                                                class="bg-white text-gray-300 dark:bg-bray-500 border-t border-bray-500">
                                                <td
                                                    class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    ${element.name || "??"}
                                                </td>
                                                <td class="py-4 px-6 text-sm whitespace-nowrap">
                                                     ${
                                                       element.client_id || "??"
                                                     }
                                                </td>
                                                <td class="py-4 px-6 text-sm whitespace-nowrap">
                                                     ${element.prefix || "??"}
                                                </td>
                                                <td class="py-4 px-2 text-sm font-medium text-right whitespace-nowrap">
                                                    <a href="#"
                                                        class="text-amethyst-600 uppercase hover:bg-amethyst-700 rounded-md hover:text-gray-300 py-2 px-10">Edit</a>
                                                </td>
                                            </tr>`;
      });
    });
}

Config = {
  Data: {
    Timestamps: [
      "123123123",
      "123123123",
      "123123123",
      "123123123",
      "123123123",
    ],
    Usage: [12, 19, 17, 18, 21],
  },
};
ctx = document.getElementById("myChart").getContext("2d");
myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Config.Data.Timestamps,
    datasets: [
      {
        label: "Memory Used",
        data: Config.Data.Usage,
        backgroundColor: ["rgba(161, 74, 212, 0.2)"],
        borderColor: ["rgba(161, 74, 212, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    fill: true,
    scales: {
      y: {
        show: false,
        beginAtZero: true,
      },
    },
  },
});
ctx = document.getElementById("myChart2").getContext("2d");
myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Config.Data.Timestamps,
    datasets: [
      {
        label: "Memory Used",
        data: Config.Data.Usage,
        backgroundColor: ["rgba(161, 74, 212, 0.2)"],
        borderColor: ["rgba(161, 74, 212, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    fill: true,
    scales: {
      y: {
        show: false,
        beginAtZero: true,
      },
    },
  },
});
