import React from 'react';
import * as RNSVGWeb from 'react-native-svg/lib/module/ReactNativeSVG.web.js';
import { StyleSheet } from 'react-native-web';

const NATIVE_ONLY_SVG_PROPS_LOWER = new Set([
  'proplist',
  'bbwidth',
  'bbheight',
  'minx',
  'miny',
  'vbwidth',
  'vbheight',
  'meetorslice',
  'tintcolor',
  'active',
  'onlayout',
  'accessible',
  'testid',
  'accessibilitylabel',
  'markerstart',
  'markermid',
  'markerend',
  'matrix',
  'font',
  'originx',
  'originy',
  'scalex',
  'scaley',
  'skewx',
  'skewy',
  'rotation',
]);

function processStyle(styleVal) {
  if (!styleVal) return undefined;
  let flat = styleVal;
  if (Array.isArray(styleVal) || typeof styleVal === 'number') {
    flat = StyleSheet.flatten(styleVal);
  }
  if (Array.isArray(flat)) {
    flat = Object.assign({}, ...flat.flat(Infinity).map(s => (typeof s === 'number' ? StyleSheet.flatten(s) : s)).filter(Boolean));
  }
  if (flat && typeof flat === 'object') {
    if (flat.shadowColor || flat.shadowOffset || flat.shadowOpacity || flat.shadowRadius) {
      const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, ...rest } = flat;
      const offsetX = shadowOffset?.width || 0;
      const offsetY = shadowOffset?.height || 0;
      const radius = shadowRadius || 0;
      const color = shadowColor || 'rgba(0,0,0,0.1)';
      rest.boxShadow = `${offsetX}px ${offsetY}px ${radius}px ${color}`;
      flat = rest;
    }
  }
  return flat;
}

function cleanSvgProps(props) {
  if (!props || typeof props !== 'object') return props;
  const cleaned = {};
  for (const key of Object.keys(props)) {
    const lowerKey = key.toLowerCase();
    if (NATIVE_ONLY_SVG_PROPS_LOWER.has(lowerKey)) continue;

    let val = props[key];

    if (key === 'style') {
      val = processStyle(val);
    } else if (key === 'fillRule' || key === 'clipRule') {
      if (val === 0 || val === '0' || val === 'evenodd') val = 'evenodd';
      else if (val === 1 || val === '1' || val === 'nonzero') val = 'nonzero';
    }

    cleaned[key] = val;
  }
  return cleaned;
}

function wrapSvgComponent(Comp) {
  if (!Comp) return Comp;
  const Wrapped = React.forwardRef((props, ref) => {
    const cleaned = cleanSvgProps(props);
    return React.createElement(Comp, { ...cleaned, ref });
  });
  Wrapped.displayName = Comp.displayName || Comp.name || 'WrappedSvgComponent';
  return Wrapped;
}

export const Svg = wrapSvgComponent(RNSVGWeb.Svg || RNSVGWeb.default);
export const Path = wrapSvgComponent(RNSVGWeb.Path);
export const Rect = wrapSvgComponent(RNSVGWeb.Rect);
export const Circle = wrapSvgComponent(RNSVGWeb.Circle);
export const G = wrapSvgComponent(RNSVGWeb.G);
export const ClipPath = wrapSvgComponent(RNSVGWeb.ClipPath);
export const Defs = wrapSvgComponent(RNSVGWeb.Defs);
export const Line = wrapSvgComponent(RNSVGWeb.Line);
export const Polygon = wrapSvgComponent(RNSVGWeb.Polygon);
export const Polyline = wrapSvgComponent(RNSVGWeb.Polyline);
export const Ellipse = wrapSvgComponent(RNSVGWeb.Ellipse);
export const Use = wrapSvgComponent(RNSVGWeb.Use);
export const Text = wrapSvgComponent(RNSVGWeb.Text);
export const TSpan = wrapSvgComponent(RNSVGWeb.TSpan);
export const Symbol = wrapSvgComponent(RNSVGWeb.Symbol);
export const LinearGradient = wrapSvgComponent(RNSVGWeb.LinearGradient);
export const RadialGradient = wrapSvgComponent(RNSVGWeb.RadialGradient);
export const Pattern = wrapSvgComponent(RNSVGWeb.Pattern);
export const Mask = wrapSvgComponent(RNSVGWeb.Mask);
export const Marker = wrapSvgComponent(RNSVGWeb.Marker);
export const ForeignObject = wrapSvgComponent(RNSVGWeb.ForeignObject);
export const Stop = wrapSvgComponent(RNSVGWeb.Stop);

export default Svg;

export const camelCase = RNSVGWeb.camelCase;
export const fetchText = RNSVGWeb.fetchText;
export const parse = RNSVGWeb.parse;
export const SvgAst = RNSVGWeb.SvgAst;
export const SvgFromUri = RNSVGWeb.SvgFromUri;
export const SvgFromXml = RNSVGWeb.SvgFromXml;
export const SvgUri = RNSVGWeb.SvgUri;
export const SvgXml = RNSVGWeb.SvgXml;
