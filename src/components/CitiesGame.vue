<template>
	<div class="Cities-game">
		<div class="Cities-game__wrapper">
			<div class="Cities-game__title">Cities</div>
			<div v-if="stage === 1" class="Cities-game__stage-one">
				<button class="Cities-game__start-button" @click="isPlayersName ? startGame() : toPlayerName()" >{{isPlayersName ? 'Enter Players Names:' : 'Input the quantity:'}}</button>
				<transition name="fadeRight">
				<input 
					v-if="!isPlayersName"
					class="Cities-game__player-input" 
					placeholder="Input the quantity of players..." 
					v-model="playersQuan"
				/>
					<input 
						class="Cities-game__main-input"
						v-else
						v-model="curPlayer"
					>
				</transition>
				<div class="Cities-game__not-enough" v-if="unableToStart">Not enough players to play!</div>
				<div class="Cities-game__not-enough" v-if="unablePlayersInput">Input something!</div>
			</div>

			<transition name="fadeRight">
				<div v-if="players.length === playersQuan" class="Cities-game__stage-two">
					<!-- <transition name="fade"></transition> -->
					<div class="Cities-game__current-player">
						{{curPlayer}}
					</div>
					<!-- <transition name="fadeRight"> -->
						<input 
							v-if="useMicro"
							class="Cities-game__micro-input"
						/>
						<div v-else="useMicro" class="Cities-game__without-micro">	
							<input 
								v-model="city"
								class="Cities-game__main-input" 
							/>
							<button @click="handleCity">Ok</button>
						</div>
					<!-- </transition> -->
					<div class="Cities-game__city-fact"></div>
				</div>
			</transition>
					<div class="Cities-game__use-micro">
						Do you want to use micro?
						<div class="Cities-game__switch-micro">
							<div :class="{active: useMicro}" @click="useMicro = true">Yes</div>
							<div :class="{active: !useMicro}" @click="useMicro = false">No</div>
						</div>
					</div>
			<div v-if="stage == 3" class="Cities-game__stage-three"></div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import data from './cities'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
	name: 'cities-game',
	data() {
		return {
			city: '',
			isPlayersName: false,
			playersQuan: 2,
			cityFact: '',
			unableToStart: false,
			unablePlayersInput: false,
			stage: 1,
			curPlayer: '',
			players: [],
			useMicro: true,
			playerTurn: 1
		}
	},
	methods: {
		getSpeech() {
			let rec = new SpeechRecognition()
			let speechRecList = new SpeechGrammarList()
			speechRecList.addFromString()
			rec.lang = 'ru-RU'

		},
		startGame() {
			if (this.curPlayer.length) {
				this.players.push(this.curPlayer)
				this.curPlayer = ''
				this.unablePlayersInput = false
				if (this.players.length === this.playersQuan) {
					this.stage = 2
					this.curPlayer = this.players[0]
				}
			} else {
				this.unablePlayersInput = true
			}
		},
		toPlayerName() {
			if (this.playersQuan < 2) {
				this.unableToStart = true
			} else {
				this.unableToStart = false
				this.isPlayersName = true
			}
		},

		handleCity() {
			if (this.city.length) {
				if (data.cities.includes(capitalizeFirstLetter(this.city))) {
					this.playerTurn = (this.playerTurn == this.playersQuan - 1 ? 0 : ++this.playerTurn)
					this.curPlayer = this.players[this.playerTurn]
				}
			}
		}
	}
}

</script>

<style lang="sass">
	$colors: ('#7dce94', '#3d3d3f', '#f6f5f3','#f9f8fd')
	@keyframes fadeIn
		0%
			opacity: 0
		100%
			opacity: 1
	
	.fadeRight
		&-enter-active
			transform: translateX(0)
			transition: all .5s ease
		&-enter
			opacity: 0
			transform: translateX(100%)
	.Cities-game
		font-family: 'Roboto', sans-serif
		color: #d4d4dc
		width: 100%
		height: 100vh
		background-color:#f9f8fd
		line-height: 16px
		&__wrapper
			width: 75%
			height: 100vh
			font-size: 32px
			display: flex
			margin: 0 auto
			flex-direction: column
			align-items: center
			justify-content: center
		&__title
			font-size: 70px
			color: #202020
		&__city-input,
		&__player-input
			outline: none
			border: none
			border-bottom: 2px solid #f9f8fd
			font-size: 36px
			background-color: transparent
			width: 60%
			margin-top: 100px
			text-transform: capitalize
			text-align: center
		&__city-fact
			padding: 15px   
			font-size: 16px
			margin-top: 40px
			animation: fadeIn .3s ease-in
		&__start-button
			font-size: 24px
			text-align: center
			padding: 10px 15px
			background-color: #feda6a
			color: white
			border-radius: 4px
			margin: 0 auto
			outline: none
			border: none
			margin-top: 50px
			color: black
			cursor: pointer
			box-shadow: 0 1px 4px #e3e4e9
			&:active
				outline: none
		&__not-enough 
			padding: 20px
			color: #DC143C
			text-align: center
			font-size: 25px
			border: 1px solid #DC143C
			border-radius: 5px
			margin-top: 20px
		&__stage-one
			display: flex
			flex-direction: column
			align-items: center

		&__main-input
			margin-top: 50px
			padding: 15px
			border: 1px solid #e3e4e9
			box-shadow: 0 1px 4px #e3e4e9
			width: 100%
			font-size: 24px
			color: #202020
			outline: none
			border-radius: 2px
		&__use-micro
			display: flex
			flex-direction: column
			font-size: 16px
			align-items: center
			position: absolute
			bottom: 50px
			left: 50%
			transform: translateX(-50%)
		&__switch-micro
			display: flex
			justify-content: center
			margin-top: 8px
			& div
				background-color: transparent
				padding: 5px 15px
				font-size: 12px
				border: 1px solid #e3e4e9
				cursor: pointer
				transition: all .3s
				&:first-child 
					border-top-left-radius: 4px
					border-bottom-left-radius: 4px
				&:last-child 
					border-top-right-radius: 4px
					border-bottom-right-radius: 4px
				&.active
					background-color: #202020
					color: white
					border-color: #202020
		&__current-player
			margin-top: 100px
			padding-bottom: 15px
			text-align: center
			font-size: 32px
			position: relative
			padding-left: 30px
			border-bottom: 1px solid #202020
			color: #202020
			&:before
				content: ''
				display: block
				position: absolute
				left: 10px
				top: 5px
				height: 10px
				width: 10px
				border: 2px solid #202020
				display: inline-block
				transform: rotate(45deg)

</style>