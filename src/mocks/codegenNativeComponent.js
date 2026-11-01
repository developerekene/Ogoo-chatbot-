import React from 'react';
import { StyleSheet } from 'react-native-web';

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => null,
};

const TAG_MAP = {
  RNSVGSvgView: 'svg',
  RNSVGSvgViewAndroid: 'svg',
  RNSVGCircle: 'circle',
  RNSVGClipPath: 'clipPath',
  RNSVGDefs: 'defs',
  RNSVGEllipse: 'ellipse',
  RNSVGGroup: 'g',
  RNSVGImage: 'image',
  RNSVGLine: 'line',
  RNSVGLinearGradient: 'linearGradient',
  RNSVGMask: 'mask',
  RNSVGPath: 'path',
  RNSVGPattern: 'pattern',
  RNSVGRadialGradient: 'radialGradient',
  RNSVGRect: 'rect',
  RNSVGSymbol: 'symbol',
  RNSVGText: 'text',
  RNSVGTSpan: 'tspan',
  RNSVGUse: 'use',
};

const PROPS_TO_REMOVE_LOWER = new Set([
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
  'bordertopleftradius',
  'bordertoprightradius',
  'borderbottomleftradius',
  'borderbottomrightradius',
  'onlayout',
  'accessible',
  'testid',
  'accessibilitylabel',
  'markerstart',
  'markermid',
  'markerend',
  'matrix',
  'originx',
  'originy',
  'scalex',
  'scaley',
  'skewx',
  'skewy',
  'rotation',
  'font',
]);

function processColorVal(color) {
  if (color == null) return undefined;
  if (typeof color === 'string') return color;
  if (typeof color === 'number') {
    if (color === 0) return 'none';
    const a = ((color >>> 24) & 0xff) / 255;
    const r = (color >>> 16) & 0xff;
    const g = (color >>> 8) & 0xff;
    const b = color & 0xff;
    if (a === 0) return 'none';
    return a < 1 ? `rgba(${r},${g},${b},${a.toFixed(2)})` : `rgb(${r},${g},${b})`;
  }
  if (typeof color === 'object') {
    if (color.type === 0 && (color.payload === 0 || color.payload === null)) return 'none';
    if (color.brushRef) return `url(#${color.brushRef})`;
    if (color.payload != null) return processColorVal(color.payload);
  }
  return undefined;
}

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

function formatTransform(transform) {
  if (!transform) return undefined;
  if (typeof transform === 'string') return transform;
  if (Array.isArray(transform)) {
    if (transform.length === 6 && typeof transform[0] === 'number') {
      return `matrix(${transform.join(',')})`;
    }
    return transform
      .map(item => {
        if (!item || typeof item !== 'object') return '';
        return Object.entries(item)
          .map(([k, v]) => `${k}(${v})`)
          .join(' ');
      })
      .filter(Boolean)
      .join(' ');
  }
  return undefined;
}

function cleanDomProps(props) {
  if (!props || typeof props !== 'object') return {};
  const cleaned = {};
  for (const key of Object.keys(props)) {
    const lowerKey = key.toLowerCase();
    if (PROPS_TO_REMOVE_LOWER.has(lowerKey)) continue;

    let val = props[key];

    if (key === 'style') {
      val = processStyle(val);
    } else if (key === 'transform') {
      val = formatTransform(val);
      if (!val) continue;
    } else if (key === 'fill' || key === 'stroke') {
      if (typeof val === 'object' || typeof val === 'number') {
        val = processColorVal(val);
      }
    } else if (key === 'fillRule' || key === 'clipRule') {
      if (val === 0 || val === '0' || val === 'evenodd') val = 'evenodd';
      else if (val === 1 || val === '1' || val === 'nonzero') val = 'nonzero';
    }

    cleaned[key] = val;
  }
  return cleaned;
}

export function codegenNativeComponent(componentName, options) {
  const tagName = TAG_MAP[componentName] || (componentName ? componentName.replace(/^RNSVG/, '').toLowerCase() : 'g');

  const Component = React.forwardRef((props, ref) => {
    const cleaned = cleanDomProps(props);
    return React.createElement(tagName, { ref, ...cleaned });
  });

  Component.displayName = componentName || 'CodegenNativeComponent';
  return Component;
}

export const codegenNativeCommands = () => ({});

export default codegenNativeComponent;
