import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import type { PluginOption } from "vite";
import { viteMockServe } from 'vite-plugin-mock';
import Inspector from "vite-plugin-vue-inspector";
import svgLoader from "vite-svg-loader";
import { pathResolve } from './tools';


export function getPluginsList(): PluginOption[] {
    return [
        vue(),
        vueJsx(),
        Components({
            dts: true
        }),
        VueI18nPlugin({
            include: [pathResolve("../locales/**")],
            fullInstall: false,
            compositionOnly: true,
        }),
        AutoImport({
            imports: [
                'vue', // 自动导入vue中的API
                'vue-router', // 自动导入vue-router中的API
                '@vueuse/core', // 自动导入@vueuse/core中的API
                'vue-i18n'
            ],
            dts: 'auto-imports.d.ts', // 生成的类型声明文件路径
        }),
        viteMockServe({
            mockPath: 'mock',
            enable: true,
            watchFiles: true,
            logger: true
        }),
        // 按下Command(⌘)+Shift(⇧)，然后点击页面元素会自动打开本地IDE并跳转到对应的代码位置
        Inspector(),
        // svg组件化支持
        svgLoader()
    ]
}

