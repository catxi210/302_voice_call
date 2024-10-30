/**
 * 加载效果，父级需要设置为relative
 * @param props
 * @returns
 */
const SKChaseLoading = (props: {
  loading: boolean,
}) => {

  const { loading } = props;

  return loading ? (
    <div className="absolute w-full h-full left-0 top-0 right-0 bottom-0 flex flex-col justify-center bg-slate-300 opacity-35 rounded-2xl">
      <div className="sk-chase m-auto">
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
        <div className="sk-chase-dot dark:before:bg-white"></div>
      </div>
    </div>
  ) : null
}
export default SKChaseLoading;
