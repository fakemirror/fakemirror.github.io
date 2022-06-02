const urlObj = new URL(location.href);
const postIdFromQuery = urlObj.searchParams.get('id');
const postIdFromParam = urlObj.pathname.slice(1);
const postId = postIdFromQuery || postIdFromParam;

if (!postId || postId === '404') {
  window.location.href = '/error.html';
}

const Index = {
  setup() {
    const { onMounted, reactive, toRefs } = Vue;
    const state = reactive({
      title: '',
      body: '',
      contributor: '',
      etherscanUrl: '',
      digest: '',
      editDate: '',
    });

    onMounted(async () => {
      try {
        const res = await fetch(`https://arweave.net/${postId}`);
        const data = await res.json();

        // 正文
        const { title, body, timestamp } = data.content;
        document.title = title || 'Fake Mirror';
        state.title = title;
        const mdHTML = marked.parse(body);
        state.body = mdHTML;

        // 文章来源
        state.contributor = data.authorship.contributor;
        state.digest = data.originalDigest;
        state.etherscanUrl = 'https://etherscan.io/address/' + state.contributor;

        // 时间处理
        state.editDate = dayjs(timestamp * 1000).format('MMM DD[th], YYYY');
      } catch (err) {
        window.location.href = '/error.html';
      }
    });

    return {
      ...toRefs(state),
    };
  },
};

Vue.createApp(Index).mount('#app');
