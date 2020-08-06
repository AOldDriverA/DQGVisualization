// WGS84基本参数（以下所有函数，除非特别说明，否则都是基于WGS84椭球参数计算）
//const WGS84a = 6378137.0;                             // 长半轴
//const WGS84b = 6356752.3142451793;
const WGS84c = 6399593.62575849;
//const WGS84f = 0.003352810664747;                 // 短半轴
//const WGS84bSquared = WGS84b * WGS84b;
//const WGS84eSquared = 0.0066943799013;                // 第一偏心率的平方
//const WGS84eToFourth = WGS84eSquared * WGS84eSquared;
//const WGS84eToSixth = WGS84eToFourth * WGS84eSquared;
//const WGS84eToEighth = WGS84eToSixth * WGS84eSquared;

const WGS84e12 = 0.006739496742276;

const WGS84b0 = 0.994977106085797;
//const WGS84b1 = 1.003364089817647;
const WGS84b2 = -0.005022893914203;
//const WGS84b3 = 0.001124189376384;
const WGS84b4 = 0.000021152428084;
//const WGS84b5 = 0.000001699459457;
const WGS84b6 = -0.000000110863458;
//const WGS84b7 = 0.000000002717858;
const WGS84b8 = 0.000000000634630;

const DegToRad = 0.01745329251994;

/**
 * 计算格网经差函数
 * @param tile 格网
 * @returns {number} 经差（输出度数）
 */
function computeWidth(tile) {
  let east = tile.east;
  let west = tile.west;
  if (east < west) {
    east += Math.PI
  }
  return east - west;
}

/**
 * 计算格网纬差
 * @param {*} tile 格网
 * @returns {*} number 纬差
 */
function computeHeight(tile) {
  return tile._north - tile._south;
}

/**
 * 计算球心到相机视点在地球上投影点的距离
 * @param camera
 * @returns {number} 球面上点到圆心的距离
 */
function computeRadius(camera) {
  let cameraLongitude = camera.positionCartographic.longitude;
  let cameraLatitude = camera.positionCartographic.latitude;
  let currentPosition = Cesium.Cartesian3.fromRadians(cameraLongitude, cameraLatitude, 0.0);
  return Math.sqrt(currentPosition.x * currentPosition.x + currentPosition.y * currentPosition.y + currentPosition.z * currentPosition.z);
}

/**
 * 计算格网分辨率（平行圈弧长）
 * @param tile
 * @returns {number}
 */
function computeGridWidth(tile) {
  let width = calculatingParallelArcLength(tile.west, tile.east, (tile.south + tile.north) / 2);
  return width;
}

/**
 * 计算格网分辨率（经线圈弧长）
 * @param tile
 * @returns {number}
 */
function computeGridHeight(tile) {
  let height = calculatingMeridianArcLength(tile.south, tile.north);
  return height;
}

/**
 * 计算WGS84椭球子午线弧长
 * @param {*} latitude1 
 * @param {*} latitude2 
 */
function calculatingMeridianArcLength(latitude1, latitude2) {
  let latitudea = latitude1 < latitude2 ? latitude1 * DegToRad : latitude2 * DegToRad;
  let latitudeb = latitude2 > latitude1 ? latitude2 * DegToRad : latitude1 * DegToRad;
  let cosLata = Math.cos(latitudea);
  let cosLatb = Math.cos(latitudeb);

  let S = WGS84c * (WGS84b0 * latitudeb + (WGS84b2 * cosLatb + WGS84b4 * cosLatb * cosLatb * cosLatb + WGS84b6 * cosLatb * cosLatb * cosLatb * cosLatb * cosLatb + WGS84b8 * cosLatb * cosLatb * cosLatb * cosLatb * cosLatb * cosLatb * cosLatb) * Math.sin(latitudeb))
    - WGS84c * (WGS84b0 * latitudea + (WGS84b2 * cosLata + WGS84b4 * cosLata * cosLata * cosLata + WGS84b6 * cosLata * cosLata * cosLata * cosLata * cosLata + WGS84b8 * cosLata * cosLata * cosLata * cosLata * cosLata * cosLata * cosLata) * Math.sin(latitudea));
  return S;
}

/**
 * 计算WGS84卯酉圈弧长
 * @param {*} longitude1 
 * @param {*} longitude2 
 * @param {*} latitude 
 */
function calculatingParallelArcLength(longitude1, longitude2, latitude) {
  let cosLat = Math.cos(latitude * DegToRad);
  if (longitude1 < longitude2) {
    return WGS84c / Math.sqrt(1.0 + WGS84e12 * cosLat * cosLat) * cosLat * (longitude2 - longitude1) * DegToRad;
  }
  else {
    return WGS84c / Math.sqrt(1.0 + WGS84e12 * cosLat * cosLat) * cosLat * (longitude1 - longitude2) * DegToRad;
  }
}

// 编码时用到的数组
const MortonTable256 = [
  0x0000n, 0x0001n, 0x0004n, 0x0005n, 0x0010n, 0x0011n, 0x0014n, 0x0015n,
  0x0040n, 0x0041n, 0x0044n, 0x0045n, 0x0050n, 0x0051n, 0x0054n, 0x0055n,
  0x0100n, 0x0101n, 0x0104n, 0x0105n, 0x0110n, 0x0111n, 0x0114n, 0x0115n,
  0x0140n, 0x0141n, 0x0144n, 0x0145n, 0x0150n, 0x0151n, 0x0154n, 0x0155n,
  0x0400n, 0x0401n, 0x0404n, 0x0405n, 0x0410n, 0x0411n, 0x0414n, 0x0415n,
  0x0440n, 0x0441n, 0x0444n, 0x0445n, 0x0450n, 0x0451n, 0x0454n, 0x0455n,
  0x0500n, 0x0501n, 0x0504n, 0x0505n, 0x0510n, 0x0511n, 0x0514n, 0x0515n,
  0x0540n, 0x0541n, 0x0544n, 0x0545n, 0x0550n, 0x0551n, 0x0554n, 0x0555n,
  0x1000n, 0x1001n, 0x1004n, 0x1005n, 0x1010n, 0x1011n, 0x1014n, 0x1015n,
  0x1040n, 0x1041n, 0x1044n, 0x1045n, 0x1050n, 0x1051n, 0x1054n, 0x1055n,
  0x1100n, 0x1101n, 0x1104n, 0x1105n, 0x1110n, 0x1111n, 0x1114n, 0x1115n,
  0x1140n, 0x1141n, 0x1144n, 0x1145n, 0x1150n, 0x1151n, 0x1154n, 0x1155n,
  0x1400n, 0x1401n, 0x1404n, 0x1405n, 0x1410n, 0x1411n, 0x1414n, 0x1415n,
  0x1440n, 0x1441n, 0x1444n, 0x1445n, 0x1450n, 0x1451n, 0x1454n, 0x1455n,
  0x1500n, 0x1501n, 0x1504n, 0x1505n, 0x1510n, 0x1511n, 0x1514n, 0x1515n,
  0x1540n, 0x1541n, 0x1544n, 0x1545n, 0x1550n, 0x1551n, 0x1554n, 0x1555n,
  0x4000n, 0x4001n, 0x4004n, 0x4005n, 0x4010n, 0x4011n, 0x4014n, 0x4015n,
  0x4040n, 0x4041n, 0x4044n, 0x4045n, 0x4050n, 0x4051n, 0x4054n, 0x4055n,
  0x4100n, 0x4101n, 0x4104n, 0x4105n, 0x4110n, 0x4111n, 0x4114n, 0x4115n,
  0x4140n, 0x4141n, 0x4144n, 0x4145n, 0x4150n, 0x4151n, 0x4154n, 0x4155n,
  0x4400n, 0x4401n, 0x4404n, 0x4405n, 0x4410n, 0x4411n, 0x4414n, 0x4415n,
  0x4440n, 0x4441n, 0x4444n, 0x4445n, 0x4450n, 0x4451n, 0x4454n, 0x4455n,
  0x4500n, 0x4501n, 0x4504n, 0x4505n, 0x4510n, 0x4511n, 0x4514n, 0x4515n,
  0x4540n, 0x4541n, 0x4544n, 0x4545n, 0x4550n, 0x4551n, 0x4554n, 0x4555n,
  0x5000n, 0x5001n, 0x5004n, 0x5005n, 0x5010n, 0x5011n, 0x5014n, 0x5015n,
  0x5040n, 0x5041n, 0x5044n, 0x5045n, 0x5050n, 0x5051n, 0x5054n, 0x5055n,
  0x5100n, 0x5101n, 0x5104n, 0x5105n, 0x5110n, 0x5111n, 0x5114n, 0x5115n,
  0x5140n, 0x5141n, 0x5144n, 0x5145n, 0x5150n, 0x5151n, 0x5154n, 0x5155n,
  0x5400n, 0x5401n, 0x5404n, 0x5405n, 0x5410n, 0x5411n, 0x5414n, 0x5415n,
  0x5440n, 0x5441n, 0x5444n, 0x5445n, 0x5450n, 0x5451n, 0x5454n, 0x5455n,
  0x5500n, 0x5501n, 0x5504n, 0x5505n, 0x5510n, 0x5511n, 0x5514n, 0x5515n,
  0x5540n, 0x5541n, 0x5544n, 0x5545n, 0x5550n, 0x5551n, 0x5554n, 0x5555n
];

const morton256_z = [
  0x00000000n,
  0x00000004n, 0x00000020n, 0x00000024n, 0x00000100n, 0x00000104n, 0x00000120n, 0x00000124n, 0x00000800n,
  0x00000804n, 0x00000820n, 0x00000824n, 0x00000900n, 0x00000904n, 0x00000920n, 0x00000924n, 0x00004000n,
  0x00004004n, 0x00004020n, 0x00004024n, 0x00004100n, 0x00004104n, 0x00004120n, 0x00004124n, 0x00004800n,
  0x00004804n, 0x00004820n, 0x00004824n, 0x00004900n, 0x00004904n, 0x00004920n, 0x00004924n, 0x00020000n,
  0x00020004n, 0x00020020n, 0x00020024n, 0x00020100n, 0x00020104n, 0x00020120n, 0x00020124n, 0x00020800n,
  0x00020804n, 0x00020820n, 0x00020824n, 0x00020900n, 0x00020904n, 0x00020920n, 0x00020924n, 0x00024000n,
  0x00024004n, 0x00024020n, 0x00024024n, 0x00024100n, 0x00024104n, 0x00024120n, 0x00024124n, 0x00024800n,
  0x00024804n, 0x00024820n, 0x00024824n, 0x00024900n, 0x00024904n, 0x00024920n, 0x00024924n, 0x00100000n,
  0x00100004n, 0x00100020n, 0x00100024n, 0x00100100n, 0x00100104n, 0x00100120n, 0x00100124n, 0x00100800n,
  0x00100804n, 0x00100820n, 0x00100824n, 0x00100900n, 0x00100904n, 0x00100920n, 0x00100924n, 0x00104000n,
  0x00104004n, 0x00104020n, 0x00104024n, 0x00104100n, 0x00104104n, 0x00104120n, 0x00104124n, 0x00104800n,
  0x00104804n, 0x00104820n, 0x00104824n, 0x00104900n, 0x00104904n, 0x00104920n, 0x00104924n, 0x00120000n,
  0x00120004n, 0x00120020n, 0x00120024n, 0x00120100n, 0x00120104n, 0x00120120n, 0x00120124n, 0x00120800n,
  0x00120804n, 0x00120820n, 0x00120824n, 0x00120900n, 0x00120904n, 0x00120920n, 0x00120924n, 0x00124000n,
  0x00124004n, 0x00124020n, 0x00124024n, 0x00124100n, 0x00124104n, 0x00124120n, 0x00124124n, 0x00124800n,
  0x00124804n, 0x00124820n, 0x00124824n, 0x00124900n, 0x00124904n, 0x00124920n, 0x00124924n, 0x00800000n,
  0x00800004n, 0x00800020n, 0x00800024n, 0x00800100n, 0x00800104n, 0x00800120n, 0x00800124n, 0x00800800n,
  0x00800804n, 0x00800820n, 0x00800824n, 0x00800900n, 0x00800904n, 0x00800920n, 0x00800924n, 0x00804000n,
  0x00804004n, 0x00804020n, 0x00804024n, 0x00804100n, 0x00804104n, 0x00804120n, 0x00804124n, 0x00804800n,
  0x00804804n, 0x00804820n, 0x00804824n, 0x00804900n, 0x00804904n, 0x00804920n, 0x00804924n, 0x00820000n,
  0x00820004n, 0x00820020n, 0x00820024n, 0x00820100n, 0x00820104n, 0x00820120n, 0x00820124n, 0x00820800n,
  0x00820804n, 0x00820820n, 0x00820824n, 0x00820900n, 0x00820904n, 0x00820920n, 0x00820924n, 0x00824000n,
  0x00824004n, 0x00824020n, 0x00824024n, 0x00824100n, 0x00824104n, 0x00824120n, 0x00824124n, 0x00824800n,
  0x00824804n, 0x00824820n, 0x00824824n, 0x00824900n, 0x00824904n, 0x00824920n, 0x00824924n, 0x00900000n,
  0x00900004n, 0x00900020n, 0x00900024n, 0x00900100n, 0x00900104n, 0x00900120n, 0x00900124n, 0x00900800n,
  0x00900804n, 0x00900820n, 0x00900824n, 0x00900900n, 0x00900904n, 0x00900920n, 0x00900924n, 0x00904000n,
  0x00904004n, 0x00904020n, 0x00904024n, 0x00904100n, 0x00904104n, 0x00904120n, 0x00904124n, 0x00904800n,
  0x00904804n, 0x00904820n, 0x00904824n, 0x00904900n, 0x00904904n, 0x00904920n, 0x00904924n, 0x00920000n,
  0x00920004n, 0x00920020n, 0x00920024n, 0x00920100n, 0x00920104n, 0x00920120n, 0x00920124n, 0x00920800n,
  0x00920804n, 0x00920820n, 0x00920824n, 0x00920900n, 0x00920904n, 0x00920920n, 0x00920924n, 0x00924000n,
  0x00924004n, 0x00924020n, 0x00924024n, 0x00924100n, 0x00924104n, 0x00924120n, 0x00924124n, 0x00924800n,
  0x00924804n, 0x00924820n, 0x00924824n, 0x00924900n, 0x00924904n, 0x00924920n, 0x00924924n
];

const interval_lat = [90.0, 45.0, 22.5, 11.25, 5.625, 2.8125, 1.40625, 0.703125, 0.3515625,
  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
  0.001373291015625, 0.000686645507813, 0.000343322753906, 0.000171661376953, 0.000085830688477,
  0.000042915344238, 0.000021457672119, 0.000010728836060, 0.000005364418030, 0.000002682209015,
  0.000001341104507, 0.000000670552254, 0.000000335276127, 0.000000167638063, 0.000000083819032];

function log2_d(n) {
  let result = 0;
  let cp = n;
  if (n & 0xffff0000) { result += 16; n >>= 16; }
  if (n & 0x0000ff00) { result += 8; n >>= 8; }
  if (n & 0x000000f0) { result += 4; n >>= 4; }
  if (n & 0x0000000c) { result += 2; n >>= 2; }
  if (n & 0x00000002) { result += 1; n >>= 1; }
  if (cp > 1 << result) result++;
  return result;
}

/**
 * 二维Morton码
 * @param {*} x 行号
 * @param {*} y 列号
 */
function mortonEncode_LUT_2(x, y) {
  let code = 0n;
  code =
    MortonTable256[(x & 0xff000000n) >> 24n] << 49n |
		MortonTable256[(y & 0xff000000n) >> 24n] << 48n |
		MortonTable256[(x & 0x00ff0000n) >> 16n] << 33n |
		MortonTable256[(y & 0x00ff0000n) >> 16n] << 32n |
		MortonTable256[(x & 0x0000ff00n) >> 8n] << 17n |
		MortonTable256[(y & 0x0000ff00n) >> 8n] << 16n |
		MortonTable256[x & 0xFFn] << 1n |
		MortonTable256[y & 0xFFn];
	return code;
}

/**
 * 三维Morton码
 * @param {*} y 行号
 * @param {*} x 列号
 * @param {*} z 时间码
 */
function mortonEncode_LUT_3(y, x, z) {
  let answer = 0n;
  answer =
		morton256_z[(z & 0xff0000n) >> 16n] << 48n |
		morton256_z[(y & 0xff0000n) >> 16n] << 47n |
		morton256_z[(x & 0xff0000n) >> 16n] << 46n |
		morton256_z[(z & 0x00ff00n) >> 8n] << 24n |
		morton256_z[(y & 0x00ff00n) >> 8n] << 23n |
		morton256_z[(x & 0x00ff00n) >> 8n] << 22n |
		morton256_z[(z & 0x0000ffn)] |
		morton256_z[(y & 0x0000ffn)] >> 1n |
		morton256_z[(x & 0x0000ffn)] >> 2n;
	return answer;
}

/**
 * DQG编码转字符串
 */
function DQGNumToStr (morton, level) {
  let a = morton.toString(4);
  for (let i = a.length; i < level; ++i) {
    a = '0' + a;
  }
  a = '1' + a;
  return a;
}

/**
 * 时空编码转字符串
 */
function DTNumToStr (DT, level) {
  let a = DT.toString(8);
  for (let i = a.length; i < level; ++i) {
    a = '0' + a;
  }
  a = '1' + a;
  return a;
}

/**
 * 时间字符串转时间编码
 */
function timeStrToCode (timeString) {
  let result = 0;
  result += parseInt(timeString.substr(2, 2)) << 26;
  result += parseInt(timeString.substr(4, 2)) << 22;
  result += parseInt(timeString.substr(6, 2)) << 17;
  result += parseInt(timeString.substr(8, 2)) << 12;
  result += parseInt(timeString.substr(10, 2)) << 6;
  result += parseInt(timeString.substr(12, 2));
  return result;
}

/**
 * 返回十进制编码
 * 这里是针对北京地区的简化版
 */
function lonLatToMorSimple (lon, lat, level = 21) {
  lon -= 90.0;
  let arr = [];
  let row = 0;
  let col = 0;
  row = (1 << level) - lat / interval_lat[level];
  row = parseInt(row);
  col = lon * (1 << (log2_d(row + 1))) / 90.0;
  col = parseInt(col);
  // eslint-disable-next-line no-undef
  arr[0] = BigInt(row);
  // eslint-disable-next-line no-undef
  arr[1] = BigInt(col);
  let morton = mortonEncode_LUT_2(arr[0], arr[1]);
  arr[2] = morton;
  return arr;
}

/**
 * 根据行列号和时间生成时空编码
 */
function rowColToDTSimple (row, col, time) {
  // 21位 2097151
  let timeCode = ((time >> 6) & 2097151);
  // eslint-disable-next-line no-undef
  timeCode = BigInt(timeCode);
  let DT = mortonEncode_LUT_3(row, col, timeCode);
  return DT;
}

/**
 * 根据经纬度和时间生成时空编码(字符串)
 * @param {*} lon 经度
 * @param {*} lat 纬度
 * @param {*} time 时间（字符串）
 * @param {*} level 层级 （默认21层）
 */
function lonLatToDTArray (lon, lat, time, level = 21) {
  lon -= 90.0;
  let row = 0;
  let col = 0;
  
  row = parseInt((1 << level) - lat / interval_lat[level]);
  col = parseInt(lon * (1 << (log2_d(row + 1))) / 90.0);
  let time1 = timeStrToCode(time);
  
  // 21位 2097151
  let timeCode = ((time1 >> 6) & 2097151);
  
  // eslint-disable-next-line no-undef
  timeCode = BigInt(timeCode);
  
  // eslint-disable-next-line no-undef
  let DT = mortonEncode_LUT_3(BigInt(row), BigInt(col), timeCode);
  let DTStr = DT.toString(8);
  for (let i = DTStr.length; i < level; ++i) {
    DTStr = '0' + DTStr;
  }
  DTStr = '1' + DTStr;
  return DTStr;
}

export {
  computeWidth,
  computeHeight,
  computeRadius,
  computeGridWidth,
  computeGridHeight,
  calculatingMeridianArcLength,
  calculatingParallelArcLength,
  DQGNumToStr,
  DTNumToStr,
  timeStrToCode,
  lonLatToMorSimple,
  rowColToDTSimple,
  lonLatToDTArray,
};
