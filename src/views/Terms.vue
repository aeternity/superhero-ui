<template>
  <div>
    <header-component></header-component>
    <right-section></right-section>
    <left-section></left-section>
    <div class="container wrapper">
      <div class="row content">
        <div class="col-sm-12">
          <h1>LEGAL IMPRINT</h1>
          <p>
            ​The present Legal Imprint was created on I. Company information
            ​13th​ February 2020.
          </p>

          <p>
            The service on ​http://youdonotneedacapetobeahero.com/​ is provided by ​Superhero.com​ LVC, e-mail for correspondence: superherowallet@protonmail.com.
          </p>

          <p>
            II. Subject of activity
            Superhero.com ​developed a website which reflects as a newsfeed users’ donations and comments to news about anything they like on the internet and gives the possibility for other users to actively donate and comment on the news available on the newsfeed. This information hub enables users to incentivize informative and accurate updates about anything all over the world- whether created by news organizations or regular people. Therefore, due to the active role of users, the website is a platform on which real-time global updates about best content shared.
          </p>

          <p>
            III. Copyright notice regarding third party links
            Please bear in mind that the ​Website’s main function is objectively and without interference to reflect donations and comments of users to third parties- organizations or regular people, sharing online news regarding best content. Therefore, ​Superhero.com ​is not the owner or author of the shared on the newsfeed news and does not in any way claim any rights over the materials in whole or partially. The materials published on the newsfeed are objects of intellectual property of the people or organizations claimed in the third-party links.
            In regard to third-party links, please bear in mind that by clicking on the available hyperlinks, users are forwarded to third-party websites. These third-party websites are not connected to Superhero.com ​and they have independent and separate policies regarding their use. Users should inform themselves about the rules applicable for each website and comply their online behaviour accordingly.
            Please note that the appearance of the links on the newsfeed is not under the control of ​Superhero.com but of users. Superhero.com ​accepts no responsibility or liability whatsoever with regard to the information provided by third parties and their hyperlink relation on the Website. The hyperlinks may forward to news regarding highly sensitive or inappropriate for some people content. Users click on the hyperlinks and visit the third-party websites on their own risk.
          </p>

          <p>
            IV. Copyright notice regarding the Website
            The legal imprint is applicable for the following internet address:​ http://www.youdonotneedacapetobeahero.com/ (hereinafter the “​Website​”)​. ​The Website belongs and is operated by ​Superhero.com .
            The concept for the ​Website​, the layout of the ​Website and the integrated components and structures for its creation, including but not limited to logos, trademarks, domain names, codes, which appear in any way on the website or are accessible in any way through the website: ​http://youdonotneedacapetobeahero.com/ are protected by the current laws with subject intellectual property. Therefore, they belong strictly and solely to ​Superhero.com ​and the use of any of the above-mentioned is a subject to prior authorisation.
            None of the above-mentioned can be reproduced, copied, edited, transmitted, downloaded or distributed in any way whatsoever partially or in whole, on any medium whatsoever, without the prior written consent of ​Superhero.com ​. Apart from this, the use for press requirements is allowed solely in compliance with intellectual property rights that are mentioned.
            The act of copying is authorised only for private, non-commercial, personal use on the personal technical devices of the user (including telephone, laptop, computer, tablet). The authorised use must not be denatured, modified, altered or changed in any way whatsoever.
          </p>

          <p>
            “COPYRIGHT – 2020 – Superhero.com ALL RIGHTS RESERVED”.
            Superhero.com ​reserves its right to take every necessary legal action against any breach or infringement
            of its intellectual property rights.
            The rules mentioned above apply to databases on the website, which are protected under the Directive 96/9/EC of the European Parliament and the Council of 11 March 1996 on the legal protection of databases.
            For any additional questions, please contact ​Superhero.com ​team at: superherowallet@protonmail.com
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
    name: 'Terms',
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
