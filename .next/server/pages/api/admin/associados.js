"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/admin/associados";
exports.ids = ["pages/api/admin/associados"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/credentials":
/*!**************************************************!*\
  !*** external "next-auth/providers/credentials" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ "(api)/./pages/api/admin/associados.ts":
/*!***************************************!*\
  !*** ./pages/api/admin/associados.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _src_lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/lib/prisma */ \"(api)/./src/lib/prisma.ts\");\n\nasync function handler(req, res) {\n    const sessionModule = await __webpack_require__.e(/*! import() */ \"_api_src_lib_serverSession_ts\").then(__webpack_require__.bind(__webpack_require__, /*! ../../../src/lib/serverSession */ \"(api)/./src/lib/serverSession.ts\"));\n    const session = await sessionModule.getSessionServer(req, res);\n    if (!session || session.user.role !== \"ADMIN\") return res.status(403).json({\n        error: \"forbidden\"\n    });\n    if (req.method === \"GET\") {\n        const q = typeof req.query.q === \"string\" ? req.query.q.trim() : \"\";\n        const where = q ? {\n            OR: [\n                {\n                    nome: {\n                        contains: q,\n                        mode: \"insensitive\"\n                    }\n                },\n                {\n                    documento: {\n                        contains: q,\n                        mode: \"insensitive\"\n                    }\n                }\n            ]\n        } : {};\n        const associados = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.associado.findMany({\n            where,\n            include: {\n                Associacoes: true\n            }\n        });\n        // reduzir para mostrar totais por associado\n        const result = associados.map((a)=>({\n                id: a.id,\n                nome: a.nome,\n                documento: a.documento,\n                totalAssociacoes: a.Associacoes.length\n            }));\n        return res.json(result);\n    }\n    if (req.method === \"POST\") {\n        const { nome, documento, consultorId, valorMensalidade } = req.body || {};\n        if (!nome || !consultorId) return res.status(400).json({\n            error: \"nome e consultorId s\\xe3o obrigat\\xf3rios\"\n        });\n        try {\n            // criar associado\n            const assoc = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.associado.create({\n                data: {\n                    nome,\n                    documento: documento || null\n                }\n            });\n            // criar associacao vinculada ao consultor fornecido\n            const associacao = await _src_lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.associacao.create({\n                data: {\n                    associadoId: assoc.id,\n                    consultorId,\n                    valorMensalidade: valorMensalidade || 0,\n                    status: \"ATIVO\",\n                    dataAssociacao: new Date()\n                }\n            });\n            return res.status(201).json({\n                associado: assoc,\n                associacao\n            });\n        } catch (err) {\n            console.error(\"Erro criando associado:\", err);\n            return res.status(500).json({\n                error: \"Erro interno ao criar associado\"\n            });\n        }\n    }\n    return res.status(405).end();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYWRtaW4vYXNzb2NpYWRvcy50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUNnRDtBQUVqQyxlQUFlQyxRQUFRQyxHQUFtQixFQUFFQyxHQUFvQjtJQUM3RSxNQUFNQyxnQkFBZ0IsTUFBTSxvTUFBTztJQUNuQyxNQUFNQyxVQUFVLE1BQU1ELGNBQWNFLGdCQUFnQixDQUFDSixLQUFLQztJQUMxRCxJQUFJLENBQUNFLFdBQVcsUUFBaUJFLElBQUksQ0FBQ0MsSUFBSSxLQUFLLFNBQVMsT0FBT0wsSUFBSU0sTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQVk7SUFFekcsSUFBSVQsSUFBSVUsTUFBTSxLQUFLLE9BQU87UUFDMUIsTUFBTUMsSUFBSSxPQUFPWCxJQUFJWSxLQUFLLENBQUNELENBQUMsS0FBSyxXQUFXWCxJQUFJWSxLQUFLLENBQUNELENBQUMsQ0FBQ0UsSUFBSSxLQUFLO1FBQ2pFLE1BQU1DLFFBQVFILElBQUk7WUFBRUksSUFBSTtnQkFBQztvQkFBRUMsTUFBTTt3QkFBRUMsVUFBVU47d0JBQUdPLE1BQU07b0JBQWM7Z0JBQUU7Z0JBQUc7b0JBQUVDLFdBQVc7d0JBQUVGLFVBQVVOO3dCQUFHTyxNQUFNO29CQUFjO2dCQUFFO2FBQUU7UUFBQyxJQUFJLENBQUM7UUFDbkksTUFBTUUsYUFBYSxNQUFNdEIsbURBQU1BLENBQUN1QixTQUFTLENBQUNDLFFBQVEsQ0FBQztZQUFFUjtZQUFPUyxTQUFTO2dCQUFFQyxhQUFhO1lBQUs7UUFBRTtRQUMzRiw0Q0FBNEM7UUFDNUMsTUFBTUMsU0FBU0wsV0FBV00sR0FBRyxDQUFDQyxDQUFBQSxJQUFNO2dCQUFFQyxJQUFJRCxFQUFFQyxFQUFFO2dCQUFFWixNQUFNVyxFQUFFWCxJQUFJO2dCQUFFRyxXQUFXUSxFQUFFUixTQUFTO2dCQUFFVSxrQkFBa0JGLEVBQUVILFdBQVcsQ0FBQ00sTUFBTTtZQUFDO1FBQzdILE9BQU83QixJQUFJTyxJQUFJLENBQUNpQjtJQUNoQjtJQUVBLElBQUl6QixJQUFJVSxNQUFNLEtBQUssUUFBUTtRQUN6QixNQUFNLEVBQUVNLElBQUksRUFBRUcsU0FBUyxFQUFFWSxXQUFXLEVBQUVDLGdCQUFnQixFQUFFLEdBQUdoQyxJQUFJaUMsSUFBSSxJQUFJLENBQUM7UUFDeEUsSUFBSSxDQUFDakIsUUFBUSxDQUFDZSxhQUFhLE9BQU85QixJQUFJTSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBc0M7UUFFdEcsSUFBSTtZQUNGLGtCQUFrQjtZQUNsQixNQUFNeUIsUUFBUSxNQUFNcEMsbURBQU1BLENBQUN1QixTQUFTLENBQUNjLE1BQU0sQ0FBQztnQkFBRUMsTUFBTTtvQkFBRXBCO29CQUFNRyxXQUFXQSxhQUFhO2dCQUFLO1lBQUU7WUFDM0Ysb0RBQW9EO1lBQ3BELE1BQU1rQixhQUFhLE1BQU12QyxtREFBTUEsQ0FBQ3VDLFVBQVUsQ0FBQ0YsTUFBTSxDQUFDO2dCQUFFQyxNQUFNO29CQUN4REUsYUFBYUosTUFBTU4sRUFBRTtvQkFDckJHO29CQUNBQyxrQkFBa0JBLG9CQUFvQjtvQkFDdEN6QixRQUFRO29CQUNSZ0MsZ0JBQWdCLElBQUlDO2dCQUN0QjtZQUFDO1lBQ0QsT0FBT3ZDLElBQUlNLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQUVhLFdBQVdhO2dCQUFPRztZQUFXO1FBQzdELEVBQUUsT0FBT0ksS0FBVTtZQUNqQkMsUUFBUWpDLEtBQUssQ0FBQywyQkFBMkJnQztZQUN6QyxPQUFPeEMsSUFBSU0sTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFrQztRQUN6RTtJQUNGO0lBRUEsT0FBT1IsSUFBSU0sTUFBTSxDQUFDLEtBQUtvQyxHQUFHO0FBQzVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2VndXJhZG9yYS1jb21pc3NvZXMvLi9wYWdlcy9hcGkvYWRtaW4vYXNzb2NpYWRvcy50cz83ZjgzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnXHJcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4uLy4uLy4uL3NyYy9saWIvcHJpc21hJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG4gIGNvbnN0IHNlc3Npb25Nb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4uLy4uLy4uL3NyYy9saWIvc2VydmVyU2Vzc2lvbicpXHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IHNlc3Npb25Nb2R1bGUuZ2V0U2Vzc2lvblNlcnZlcihyZXEsIHJlcylcclxuICBpZiAoIXNlc3Npb24gfHwgKHNlc3Npb24gYXMgYW55KS51c2VyLnJvbGUgIT09ICdBRE1JTicpIHJldHVybiByZXMuc3RhdHVzKDQwMykuanNvbih7IGVycm9yOiAnZm9yYmlkZGVuJyB9KVxyXG5cclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcclxuICBjb25zdCBxID0gdHlwZW9mIHJlcS5xdWVyeS5xID09PSAnc3RyaW5nJyA/IHJlcS5xdWVyeS5xLnRyaW0oKSA6ICcnXHJcbiAgY29uc3Qgd2hlcmUgPSBxID8geyBPUjogW3sgbm9tZTogeyBjb250YWluczogcSwgbW9kZTogJ2luc2Vuc2l0aXZlJyB9IH0sIHsgZG9jdW1lbnRvOiB7IGNvbnRhaW5zOiBxLCBtb2RlOiAnaW5zZW5zaXRpdmUnIH0gfV0gfSA6IHt9XHJcbiAgY29uc3QgYXNzb2NpYWRvcyA9IGF3YWl0IHByaXNtYS5hc3NvY2lhZG8uZmluZE1hbnkoeyB3aGVyZSwgaW5jbHVkZTogeyBBc3NvY2lhY29lczogdHJ1ZSB9IH0pXHJcbiAgLy8gcmVkdXppciBwYXJhIG1vc3RyYXIgdG90YWlzIHBvciBhc3NvY2lhZG9cclxuICBjb25zdCByZXN1bHQgPSBhc3NvY2lhZG9zLm1hcChhID0+ICh7IGlkOiBhLmlkLCBub21lOiBhLm5vbWUsIGRvY3VtZW50bzogYS5kb2N1bWVudG8sIHRvdGFsQXNzb2NpYWNvZXM6IGEuQXNzb2NpYWNvZXMubGVuZ3RoIH0pKVxyXG4gIHJldHVybiByZXMuanNvbihyZXN1bHQpXHJcbiAgfVxyXG5cclxuICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICBjb25zdCB7IG5vbWUsIGRvY3VtZW50bywgY29uc3VsdG9ySWQsIHZhbG9yTWVuc2FsaWRhZGUgfSA9IHJlcS5ib2R5IHx8IHt9XHJcbiAgICBpZiAoIW5vbWUgfHwgIWNvbnN1bHRvcklkKSByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogJ25vbWUgZSBjb25zdWx0b3JJZCBzw6NvIG9icmlnYXTDs3Jpb3MnIH0pXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gY3JpYXIgYXNzb2NpYWRvXHJcbiAgICAgIGNvbnN0IGFzc29jID0gYXdhaXQgcHJpc21hLmFzc29jaWFkby5jcmVhdGUoeyBkYXRhOiB7IG5vbWUsIGRvY3VtZW50bzogZG9jdW1lbnRvIHx8IG51bGwgfSB9KVxyXG4gICAgICAvLyBjcmlhciBhc3NvY2lhY2FvIHZpbmN1bGFkYSBhbyBjb25zdWx0b3IgZm9ybmVjaWRvXHJcbiAgICAgIGNvbnN0IGFzc29jaWFjYW8gPSBhd2FpdCBwcmlzbWEuYXNzb2NpYWNhby5jcmVhdGUoeyBkYXRhOiB7XHJcbiAgICAgICAgYXNzb2NpYWRvSWQ6IGFzc29jLmlkLFxyXG4gICAgICAgIGNvbnN1bHRvcklkLFxyXG4gICAgICAgIHZhbG9yTWVuc2FsaWRhZGU6IHZhbG9yTWVuc2FsaWRhZGUgfHwgMCxcclxuICAgICAgICBzdGF0dXM6ICdBVElWTycsXHJcbiAgICAgICAgZGF0YUFzc29jaWFjYW86IG5ldyBEYXRlKClcclxuICAgICAgfX0pXHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMSkuanNvbih7IGFzc29jaWFkbzogYXNzb2MsIGFzc29jaWFjYW8gfSlcclxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm8gY3JpYW5kbyBhc3NvY2lhZG86JywgZXJyKVxyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0Vycm8gaW50ZXJubyBhbyBjcmlhciBhc3NvY2lhZG8nIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmVuZCgpXHJcbn1cclxuIl0sIm5hbWVzIjpbInByaXNtYSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJzZXNzaW9uTW9kdWxlIiwic2Vzc2lvbiIsImdldFNlc3Npb25TZXJ2ZXIiLCJ1c2VyIiwicm9sZSIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsIm1ldGhvZCIsInEiLCJxdWVyeSIsInRyaW0iLCJ3aGVyZSIsIk9SIiwibm9tZSIsImNvbnRhaW5zIiwibW9kZSIsImRvY3VtZW50byIsImFzc29jaWFkb3MiLCJhc3NvY2lhZG8iLCJmaW5kTWFueSIsImluY2x1ZGUiLCJBc3NvY2lhY29lcyIsInJlc3VsdCIsIm1hcCIsImEiLCJpZCIsInRvdGFsQXNzb2NpYWNvZXMiLCJsZW5ndGgiLCJjb25zdWx0b3JJZCIsInZhbG9yTWVuc2FsaWRhZGUiLCJib2R5IiwiYXNzb2MiLCJjcmVhdGUiLCJkYXRhIiwiYXNzb2NpYWNhbyIsImFzc29jaWFkb0lkIiwiZGF0YUFzc29jaWFjYW8iLCJEYXRlIiwiZXJyIiwiY29uc29sZSIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/admin/associados.ts\n");

/***/ }),

/***/ "(api)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = globalThis.__prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalThis.__prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFPdEMsTUFBTUMsU0FBU0MsV0FBV0MsUUFBUSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBQy9ELElBQUlJLElBQXlCLEVBQWNGLFdBQVdDLFFBQVEsR0FBR0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZWd1cmFkb3JhLWNvbWlzc29lcy8uL3NyYy9saWIvcHJpc21hLnRzPzAxZDciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZhclxyXG4gIHZhciBfX3ByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxUaGlzLl9fcHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsVGhpcy5fX3ByaXNtYSA9IHByaXNtYVxyXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiZ2xvYmFsVGhpcyIsIl9fcHJpc21hIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/admin/associados.ts"));
module.exports = __webpack_exports__;

})();