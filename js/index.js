const Index = {
  setup() {
    const { onMounted, reactive, toRefs } = Vue;

    const state = reactive({
      title: '',
      body: '',
      contributor: '',
      etherscanUrl: '',
      digest: '',
      version: '',
      fakeTime: '',
    });

    const urlObj = new URL(location.href);
    const postId = urlObj.searchParams.get('id');

    onMounted(async () => {
      try {
        const res = await fetch(`https://arweave.net/${postId}`);
        const data = await res.json();
        console.log(data);

        // 正文
        const { title, body } = data.content;
        document.title = title || 'Fake Mirror';
        state.title = title;
        const mdHTML = marked.parse(body);
        state.body = mdHTML;

        // 文章来源
        state.contributor = data.authorship.contributor;
        state.digest = data.originalDigest;
        state.etherscanUrl = 'https://etherscan.io/address/' + state.contributor;

        // 时间处理
        state.version = dayjs(data.version.replace('-', '/')).format('MMM DD[th], YYYY');
        state.fakeTime = dayjs(data.content.timestamp * 1000).format('MMM DD[th], YYYY');
      } catch (err) {
        window.location.href = '/404.html';
      }
    });

    return {
      ...toRefs(state),
    };
  },
};

Vue.createApp(Index).mount('#app');
