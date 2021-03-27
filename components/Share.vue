<template>
	<span>
		<b-button
		size="is-small"
		v-clipboard:copy="shareUrl"
		v-clipboard:success="copySuccess"
		v-clipboard:error="copyError"
		type="is-text">
		link</b-button>
		<b-button
			tag="a"
			type="is-link"
			@click="popup(facebookUrl)"
			size="is-small"
			icon-right="facebook"
		/>
	</span>
</template>
<script lang="ts">
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'

@Component
export default class Share extends Vue {
	@Prop(String) shareUrl!: String
	get facebookUrl() {
		return "https://www.facebook.com/sharer/sharer.php?u="+this.shareUrl
	}

	popup(link: string) {
		window.open(link ,'popup','width=600,height=600');
	}

	copySuccess() {
		this.$buefy.toast.open({
			message: 'Odkaz na položku byl zkopírován do schránky',
			type: 'is-success'
		})
	}

	copyError() {
		this.$buefy.dialog.prompt({
			message: `Zkopírujte si odkaz.`,
			inputAttrs: {
				value: this.shareUrl,
				placeholder: 'Oh, tys to smazal!',
				maxlength: 50
			},
			trapFocus: true,
		})
	}
}
</script>
