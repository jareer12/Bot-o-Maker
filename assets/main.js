function boolToCheck(bool) {
  if (bool == 1) {
    return true;
  } else {
    return false;
  }
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
if (document.getElementById("bot-data")) {
  try {
    BotData =
      JSON.parse(document.getElementById("bot-data").innerHTML || {}) || {};
    if (document.getElementById("token_display")) {
      document.getElementById("token_display").value = BotData.token;
      document.getElementById("prefix_display").value = BotData.prefix;
    }
  } catch {
    BotData = {};
  }
}

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
                                                <td class="py-4 px-6 text-sm whitespace-nowrap">
                                                     ${new Date(
                                                       element.created * 1000
                                                     ).toDateString()}
                                                </td>
                                                <td class="py-4 px-2 text-sm font-medium text-right whitespace-nowrap">
                                                    <a href="../manage/${
                                                      element.client_id || "??"
                                                    }"
                                                        class="text-amethyst-600 uppercase hover:bg-amethyst-700 rounded-md hover:text-gray-300 py-2 px-8">MANAGE</a>
                                                </td>
                                            </tr>`;
      });
    });
}

if (document.getElementById("myChart")) {
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
}

function toggleFeature(feature) {
  fetch(`../toggle-feature/${BotData.client_id}?feature=${feature}`)
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {});
}

elms = document.getElementsByTagName("*");
for (let i = 0; i < elms.length; i++) {
  const element = elms[i];
  if (element.getAttribute("bot-feature")) {
    console.log(
      BotData[`${element.getAttribute("bot-feature").toLowerCase()}_feature`]
    );
    if (
      BotData[`${element.getAttribute("bot-feature").toLowerCase()}_feature`]
    ) {
      element.checked = boolToCheck(
        BotData[`${element.getAttribute("bot-feature").toLowerCase()}_feature`]
      );
    }
    element.addEventListener("click", function () {
      toggleFeature(element.getAttribute("bot-feature"));
    });
  }
}

swalcolor = "#e5e7eb";
swalbg = "#13131D";

function __SideBad(message) {
  Swal.fire({
    position: "top-end",
    icon: "error",
    text: message,
    color: swalcolor,
    background: swalbg,
    showConfirmButton: false,
    timer: 1500,
  });
}

function __SideAlert(message) {
  Swal.fire({
    position: "top-end",
    icon: "warn",
    text: message,
    color: swalcolor,
    background: swalbg,
    showConfirmButton: false,
    timer: 1500,
  });
}

function __SideGood(message) {
  Swal.fire({
    position: "top-end",
    icon: "success",
    color: swalcolor,
    background: swalbg,
    text: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

function compile() {
  fetch(`../compile?id=${BotData.client_id || 0}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Success) {
        __SideGood(data.Message);
      } else {
        __SideBad(data.Message);
      }
    });
}

if (document.getElementById("cpu_chart_usage")) {
  function render(data, stamp) {
    chart_div.innerHTML = `<canvas id="cpu_chart_usage" class="w-full" style="height:50vh;"></canvas>`;
    let ctx = document.getElementById("cpu_chart_usage").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: stamp,
        datasets: [
          {
            label: "Memory Used",
            data: data,
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
  }
  setInterval(() => {
    fetch("../json/stats")
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        renderStats();
      });
  }, 976); // Fetch takes time so it's 976
}

function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(2) + byteUnits[i];
}

function renderStats() {
  fetch("../json/stats")
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      if (document.getElementById("db_size")) {
        document.getElementById("db_size").innerHTML =
          getReadableFileSizeString(myJson.Data.MySQL.Size.Size);
      }
      if (document.getElementById("bot_size")) {
        document.getElementById("bot_size").innerHTML = myJson.Data.MySQL.Bots;
      }
      if (document.getElementById("cpu_usage")) {
        document.getElementById("cpu_usage").innerHTML =
          getReadableFileSizeString(myJson.Data.Server.Ram);
      }
    });
}

function update_prefix() {
  fetch(
    `../update-prefix/${BotData.client_id}?prefix=${
      document.getElementById("prefix_display").value
    }`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Success) {
        __SideGood(data.Message);
      } else {
        __SideBad(data.Message);
      }
    });
}

function update_token() {
  fetch(
    `../update-token/${BotData.client_id}?token=${
      document.getElementById("token_display").value
    }`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Success) {
        __SideGood(data.Message);
      } else {
        __SideBad(data.Message);
      }
    });
}

function restart_bot() {
  fetch(`../restart/${BotData.client_id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Success) {
        __SideGood(data.Message);
      } else {
        __SideBad(data.Message);
      }
    });
}

function statusToIcon(status) {
  if (status == "online") {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>`;
  } else if (status == "offline") {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>`;
  }
}

fetch(`../list-bots`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    maxDisplay = 5;
    current = 0;
    document.getElementById("bot-list").innerHTML = null;
    data.Data.forEach((element) => {
      if (current >= maxDisplay) return;
      document.getElementById(
        "bot-list"
      ).innerHTML += `<div class="text-gray-300 text-sm w-full px-3 py-3 grid grid-cols-2 bg-bray-500 rounded-md">
                                <div class="flex items-center space-x-1">
                                    <span class="text-emerald font-bold rounded-full">
                                        ${statusToIcon(element.pm2_env.status)}
                                    </span>
                                    <h1 class="py-1">Bot Name<h1>
                                </div>
                                <div>
                                    <a href="../manage/${
                                      element.name
                                    }" class="bg-amethyst rounded-md px-3 py-1 float-right">Manage</a>
                                </div>
                            </div>`;
      current++;
    });
  });

renderStats();
