// 默认绘制单尺度网格
const drawDefault = (state) => {
  state.isDrawDefaultClick = !state.isDrawDefaultClick;
  state.isDrawDefault = !state.isDrawDefault;
}

const drawDefaultFalse = (state) => {
  state.isDrawDefault = false;
}

// 绘制单尺度网格
const draw2dDQG = (state) => {
  state.isDraw2dDQGClick = !state.isDraw2dDQGClick;
  state.isDraw2dDQG = !state.isDraw2dDQG;
}

const draw2dDQGFalse = (state) => {
  state.isDraw2dDQG = false;
}

// 绘制多尺度网格
const drawMultiDQG = (state) => {
  state.isDrawMultiDQGClick = !state.isDrawMultiDQGClick;
  state.isDrawMultiDQG = !state.isDrawMultiDQG;
}

const drawMultiDQGFalse = (state) => {
  state.isDrawMultiDQG = false;
}

// 显示面板信息（在js里触发时）
const showGridInfoTrue = (state) => {
  state.isShowGridInfo = true;
}

const showGridInfoFalse = (state) => {
  state.isShowGridInfo = false;
}

// 当鼠标移入“网格”导航栏时
const showSelectDrawTrue = (state) => {
  state.isShowSelectDraw = true;
}

const showSelectDrawFalse = (state) => {
  state.isShowSelectDraw = false;
}

export default {
  drawDefault,
  draw2dDQG,
  drawMultiDQG,
  drawDefaultFalse,
  draw2dDQGFalse,
  drawMultiDQGFalse,
  showGridInfoTrue,
  showGridInfoFalse,
  showSelectDrawTrue,
  showSelectDrawFalse,
}