<template>
  <div>
    <header-component></header-component>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper">
      <div class="row content">
        <div class="col-sm-12">
          <h2>
            Introducing Superhero: fully P2P tipping with no boundaries, no censorship — at near-zero fees
          </h2>
          <p>
            Enabling blockchain interactions through user-friendly consumer applications that everyday people can actually use is critical to mainstream adoption. At the same time, blockchain technology’s promise of delivering a better Internet remains a promise to be fulfilled. 
          </p>
          <p>
            As a solution to both of these points, developers have launched the Superhero wallet—which would allow users to send tips to anyone with an online profile, anywhere in the world. Users can tip their favorite content creators, musicians, artists, as well as support research, good causes, and anything on the Internet—even when the intended recipients don’t have the wallet yet.
          </p>
          <p>
            Superhero breaks down the current centralized state of content monetization platforms—wherein custodians can decide at any point to deny service to certain content creators based on their own personal prejudices. Superhero cannot, and will never be able to take away anyone’s ability to receive tips from their supporters. This is because Superhero is a trustless system: there are no custodians or third party institutions that screen transactions. Superhero brings people back their power to free transaction—a right that should have always been theirs. 
          </p>
          <p>
            Even better, transactions through the wallet are practically free—near-zero fees are possible because the payment system utilizes æternity blockchain’s state channels technology.
          </p>
          <p>
            In keeping with blockchain technology’s principle of transparency, all transactions made through Superhero are recorded on this similarly named aggregator, YouDoNotNeedACapeToBeAHero.com. The website serves as a public record through which users can read posts from other Superhero users, as well as interact and engage in discussions through comments. They can also reward other users for contributing to a better Internet. 
          </p>
          <p>
            For those who want to get a glimpse of what the free web really looks like, this is the right place to start. 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import HeaderComponent from '../components/layout/HeaderComponent.vue';
  import LeftSectionComponent from '../components/layout/LeftSectionComponent.vue';
  import RightSectionComponent from '../components/layout/RightSectionComponent.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'Privacy',
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters(['account', 'balance', 'isLoggedIn', 'current']),
    },
    methods: {
    },
    components: {
      'header-component': HeaderComponent,
      'left-section': LeftSectionComponent,
      'right-section': RightSectionComponent,
    },
    async created() {

    },
  }
</script>


<style lang="scss" scoped>
  @import "../styles/base";

  .content {
    color: $primary_color;
  }

  .container.wrapper{
    min-height: 4rem;
  }

</style>
