/* 藥水圖示（內嵌 SVG） */
// Self-generated potion icons. They are inline SVG data URLs, so the HTML works offline.
const POT_ICON={
 hp:'<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><path d=\"M23 7h18v8l-4 4v5c8 3 13 10 13 19 0 10-8 17-19 17S12 53 12 43c0-9 5-16 13-19v-5l-4-4z\" fill=\"#d9e7ff\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M19 34c4-4 8-6 13-6 7 0 12 3 16 8v6c0 8-6 13-16 13S16 50 16 42c0-3 1-6 3-8z\" fill=\"#d62845\"/><path d=\"M32 31v18M23 40h18\" stroke=\"#fff\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M25 10h14\" stroke=\"#e9c880\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>',
 mp:'<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><path d=\"M23 7h18v8l-4 4v5c8 3 13 10 13 19 0 10-8 17-19 17S12 53 12 43c0-9 5-16 13-19v-5l-4-4z\" fill=\"#d9e7ff\" stroke=\"#fff\" stroke-width=\"2\"/><path d=\"M19 34c4-4 8-6 13-6 7 0 12 3 16 8v6c0 8-6 13-16 13S16 50 16 42c0-3 1-6 3-8z\" fill=\"#2475dc\"/><path d=\"M32 31c5 6 8 9 8 13a8 8 0 1 1-16 0c0-4 3-7 8-13z\" fill=\"#e8f7ff\"/><path d=\"M25 10h14\" stroke=\"#e9c880\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>'
};
const potIconImg=t=>'<img src=\"data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(POT_ICON[t])+'\" alt=\"'+(t==='hp'?'HP':'MP')+'藥水\">';
