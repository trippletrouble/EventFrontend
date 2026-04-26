var a2_hs_red = "#FD3D4E";
var a3_hs_red = "#EC6F79";
var a2_hs_yellow = "#FDCD01";
var a3_hs_yellow = "#FFE05E";
var a2_hs_green = "#0AD88E";
var a3_hs_green = "#47EBB0";
var a2_hs_blue = "#336AFF";
var a3_hs_blue = "#89A9FF";
var a2_a3_text = "#000000";
var baseUrl = "https://webaim.org/resources/contrastchecker/"; // https://webaim.org/resources/contrastchecker/?fcolor=000000&bcolor=EC6F79&api

var fetchApi = function () {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.apply(globalThis, arguments);
  }
  return import('node-fetch').then(function (module) {
    return module.default.apply(null, arguments);
  });
};

function normalizeHex(color) {
  return color.replace('#', '').toUpperCase();
}

test('a2 bg:yellow text:black contrast ratio returns pass for AA and AALarge', async () => {
  var fcolor = normalizeHex(a2_a3_text);
  var bcolor = normalizeHex(a2_hs_yellow);
  var url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  var response = await fetchApi(url);
  expect(response.ok).toBe(true);

  var json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:green text:black contrast ratio returns pass for AA and AALarge', async () => {
  var fcolor = normalizeHex(a2_a3_text);
  var bcolor = normalizeHex(a2_hs_green);
  var url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  var response = await fetchApi(url);
  expect(response.ok).toBe(true);

  var json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:blue text:black contrast ratio returns pass for AA and AALarge', async () => {
  var fcolor = normalizeHex(a2_a3_text);
  var bcolor = normalizeHex(a2_hs_blue);
  var url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  var response = await fetchApi(url);
  expect(response.ok).toBe(true);

  var json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:red text:black contrast ratio returns pass for AA and AALarge', async () => {
  var fcolor = normalizeHex(a2_a3_text);
  var bcolor = normalizeHex(a2_hs_red);
  var url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  var response = await fetchApi(url);
  expect(response.ok).toBe(true);

  var json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('low contrast ratio fails test', async ()=> {
  var fcolor = normalizeHex("#000000");
  var bcolor = normalizeHex("#000000");
  
  var url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  var response = await fetchApi(url);
  expect(response.ok).toBe(true);

  var json = await response.json();
  expect(json).toHaveProperty('AA', 'fail');
  expect(json).toHaveProperty('AALarge', 'fail');
  expect(json).toHaveProperty('AAA', 'fail');
  expect(json).toHaveProperty('AAALarge', 'fail');
})