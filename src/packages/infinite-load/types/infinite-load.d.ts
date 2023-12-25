/**
 * @description: 无限加载
 */
type DoneFn = <Data>(cancel?: boolean) => Promise<Data>


export interface InfiniteLoadPropsType {
  /**
   * 加载函数
   */
  load: DoneFn
  /**
   * 延迟加载时间
   * @default 200
   */
  delay?: number,
  /**
   * 触发加载的距离
   * @default 0
   */
  distance?: number,
  /**
   * 是否立即加载
   * @default true
   */
  immediate?: boolean,
  /**
   * 是否禁用加载
   * @default false
   */
  disabled?: boolean,
  /**
   * 加载文案
   * @default 加载中...
   */
  loadingText?: string,
  /**
   * 加载完成文案
   * @default 没有更多数据了
   */
  endText?: string,
  /**
   * 空数据文案
   * @default 暂无数据
   */
  emptyText?: string,
}
