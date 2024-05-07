export function useScroll() {

    function toTop() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        }
        )
    }
    return {
        toTop
    };
}