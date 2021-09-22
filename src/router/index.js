import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("../views/Home.vue")
	},
	{
		path: "/rx",
		name: "rx-demo",
		component: () => import("../views/rxjs"),
		children: [
			{
				path: "/rx/pull-refresh",
				name: "rx-pull-refresh",
				component: () => import("../views/rxjs/pull-refresh")
			},
			{
				path: "/rx/fetch",
				name: "rx-fetch",
				component: () => import("../views/rxjs/fetch")
			},
			{
				path: "/rx/toast",
				name: "rx-toast",
				component: () => import("../views/rxjs/toast")
			},
			{
				path: "/rx/ScaleRx",
				name: "rx-ScaleRx",
				component: () => import("../views/rxjs/ScaleRx")
			},
			{
				path: "/rx/test",
				name: "rx-test",
				component: () => import("../views/rxjs/rx-test")
			},
			{
				path: "/rx/last-fetch-data",
				name: "rx-last-fetch-data",
				component: () => import("../views/rxjs/last-fetch-data")
			},
			{
				path: "/rx/send-verification-code",
				name: "rx-send-verification-code",
				component: () => import("../views/rxjs/send-verification-code")
			},
			{
				path: "/rx/wait-time-fetch",
				name: "rx-wait-time-fetch",
				component: () => import("../views/rxjs/wait-time-fetch")
			},
			{
				path: "/rx/get-img",
				name: "rx-get-img",
				component: () => import("../views/rxjs/get-img")
			},
			{
				path: "/rx/req",
				name: "rx-req",
				component: () => import("../views/rxjs/req")
			},
			{
				path: "/rx/drag",
				name: "rx-drag",
				component: () => import("../views/rxjs/drag")
			},
			{
				path: "/rx/subject",
				name: "rx-subject",
				component: () => import("../views/rxjs/subject")
			},
			{
				path: "/rx/lazy-load-list",
				name: "rx-lazy-load-list",
				component: () => import("../views/rxjs/lazy-load-list")
			}
		]
	},
	{
		path: "/rxppt",
		name: "rx-ppt",
		component: () => import("../views/rxjs-ppt/index.vue"),
		children: [
			{
				path: "/rxppt-1",
				name: "rxppt-1",
				component: () => import("../views/rxjs-ppt/1.vue")
			},
			{
				path: "/rxppt-2",
				name: "rxppt-2",
				component: () => import("../views/rxjs-ppt/2.vue")
			},
			{
				path: "/rxppt-3",
				name: "rxppt-3",
				component: () => import("../views/rxjs-ppt/3.vue")
			},
			{
				path: "/rxppt-4",
				name: "rxppt-4",
				component: () => import("../views/rxjs-ppt/4.vue")
			}
		]
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
