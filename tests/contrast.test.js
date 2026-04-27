const a2_hs_red = "#FD3D4E";
const a3_hs_red = "#EC6F79";
const a2_hs_yellow = "#FDCD01";
const a3_hs_yellow = "#FFE05E";
const a2_hs_green = "#0AD88E";
const a3_hs_green = "#47EBB0";
const a2_hs_blue = "#336AFF";
const a3_hs_blue = "#89A9FF";
const a2_a3_text = "#000000";
const baseUrl = "https://webaim.org/resources/contrastchecker/"; // https://webaim.org/resources/contrastchecker/?fcolor=000000&bcolor=EC6F79&api

const fetchApi = function () {
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
  const fcolor = normalizeHex(a2_a3_text);
  const bcolor = normalizeHex(a2_hs_yellow);
  const url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  const response = await fetchApi(url);
  expect(response.ok).toBe(true);

  const json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:green text:black contrast ratio returns pass for AA and AALarge', async () => {
  const fcolor = normalizeHex(a2_a3_text);
  const bcolor = normalizeHex(a2_hs_green);
  const url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  const response = await fetchApi(url);
  expect(response.ok).toBe(true);

  const json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:blue text:black contrast ratio returns pass for AA and AALarge', async () => {
  const fcolor = normalizeHex(a2_a3_text);
  const bcolor = normalizeHex(a2_hs_blue);
  const url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  const response = await fetchApi(url);
  expect(response.ok).toBe(true);

  const json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('a2 bg:red text:black contrast ratio returns pass for AA and AALarge', async () => {
  const fcolor = normalizeHex(a2_a3_text);
  const bcolor = normalizeHex(a2_hs_red);
  const url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  const response = await fetchApi(url);
  expect(response.ok).toBe(true);

  const json = await response.json();
  expect(json).toHaveProperty('AA', 'pass');
  expect(json).toHaveProperty('AALarge', 'pass');
});

test('low contrast ratio fails test', async ()=> {
  const fcolor = normalizeHex("#000000");
  const bcolor = normalizeHex("#000000");
  
  const url = `${baseUrl}?fcolor=${encodeURIComponent(fcolor)}&bcolor=${encodeURIComponent(bcolor)}&api`;

  const response = await fetchApi(url);
  expect(response.ok).toBe(true);

  const json = await response.json();
  expect(json).toHaveProperty('AA', 'fail');
  expect(json).toHaveProperty('AALarge', 'fail');
  expect(json).toHaveProperty('AAA', 'fail');
  expect(json).toHaveProperty('AAALarge', 'fail');
})