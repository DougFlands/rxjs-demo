export class Observable {
	_subscribe;
	// 创建符的this上下文
	_creationOperator;
	// 创建符的 unsubscribe 函数
	unsubscribe;
	// 在实例化时，第二个参数传入 unsubscribe 函数
	constructor(subscribe, unsubscribe) {
		this._subscribe = subscribe;
		this._creationOperator = this;
		this.unsubscribe = unsubscribe;
	}
	pipe(...operations) {
		// 将 pipe 中操作符顺序执行，且在第二个参数中传入创建符的 this 上下文
		return operations.reduce((prev, fn) => {
			// 标记:1
			return fn(prev, this._creationOperator);
		}, this);
	}
	subscribe(observer) {
		const defaultObserver = {
			next: () => {},
			error: () => {},
			complete: () => {}
		};
		if (typeof observer === "function") {
			return this._subscribe({ ...defaultObserver, next: observer });
		} else {
			return this._subscribe({ ...defaultObserver, ...observer });
		}
	}
}

export function of(...args) {
	return new Observable((observer) => {
		args.forEach((arg) => {
			observer.next(arg);
		});
		observer.complete();
	});
}

export function fromEvent(element, event) {
	let handler;
	return new Observable(
		(observer) => {
			handler = (e) => observer.next(e);
			element.addEventListener(event, handler);
		},
		() => element.removeEventListener(event, handler)
	);
}

export function interval(delay) {
	let time = null;
	return new Observable(
		(observer) => {
			let index = 0;
			time = setInterval(() => {
				observer.next(index++);
			}, delay);
		},
		() => clearInterval(time)
	);
}

export function filter(fn) {
	return (observable, creationOperator) =>
		new Observable((observer) => {
			observable.subscribe({
				next: (val) => (fn(val) ? observer.next(val) : () => {}),
				error: (err) => observer.error(err),
				complete: () => observer.complete()
			});
			return creationOperator;
		});
}

export function map(fn) {
	// 这里的实参为 标记:1 传入的参数
	return (observable, creationOperator) =>
		new Observable((observer) => {
			observable.subscribe({
				next: (val) => observer.next(fn(val)),
				error: (err) => observer.error(err),
				complete: () => observer.complete()
			});
			return creationOperator;
		});
}
