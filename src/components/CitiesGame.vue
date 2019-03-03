<template>
	<div class="Cities-game">
		<div class="Cities-game__wrapper">
			<div class="Cities-game__title">Cities</div>
			<div v-if="stage === 1" class="Cities-game__stage-one">
				<button class="Cities-game__main-button" @click="isPlayersName ? startGame() : toPlayerName()" >{{isPlayersName ? 'Enter Players Names:' : 'Input the quantity:'}}</button>
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
				<div class="Cities-game__not-enough" v-if="unablePlayersInput">The length of the name must be higher than 2 and less than 15!</div>

			</div>

			<div v-if="players.length === playersQuan" class="Cities-game__stage-two">
				<transition name="fadeRight">
					<div class="Cities-game__transition-wrapper">
						<div class="Cities-game__current-player">
							{{curPlayer}}
						</div>
							<button 
								v-if="useMicro"
								class="Cities-game__main-button"
								@click="handleCity"
							>Tap to speak!</button>
							<div v-else="useMicro" class="Cities-game__without-micro">	
								<input 
									v-model="city"
									class="Cities-game__main-input" 
								/>
								<button 
									@click="handleCity">Check</button>
							</div>
						<!-- </transition> -->
						<div v-if="curCityName.length" class="Cities-game__city-name">{{curCityName}}</div>	
						<div v-if="curCityFact.length" class="Cities-game__city-fact">{{curCityFact}}</div>
						<div class="Cities-game__not-enough" v-if="inputAnotherWarn">Type another city!</div>
					</div>
				</transition>
				<div class="Cities-game__city-count">{{cityCount}}</div>
				<div class="Cities-game__use-micro">
					Do you want to use micro?
					<div class="Cities-game__switch-micro">
						<div :class="{active: useMicro}" @click="useMicro = true">Yes</div>
						<div :class="{active: !useMicro}" @click="useMicro = false">No</div>
					</div>
				</div>
			</div>
			<div v-if="stage == 3" class="Cities-game__stage-three"></div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import data from './cities'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const grammar = '#JSGF V1.0; grammar citites; public <city> = ' + data.cities.join(' | ').toLowerCase() + ' ;'

const recognition = new SpeechRecognition()
const speechRecognitionList = new SpeechGrammarList()

speechRecognitionList.addFromString(grammar, 1)

recognition.grammars = speechRecognitionList
recognition.lang = 'ru-RU'
recognition.interimResults = false 
recognition.maxAlternatives = 1

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}


export default {
	name: 'cities-game',
	data() {
		return {
			city: '',
			maxPlayerTries: 3,
			isPlayersName: false,
			playersQuan: 2,
			cityFact: '',
			unableToStart: false,
			unablePlayersInput: false,
			stage: 1,
			curPlayer: '',
			players: [],
			useMicro: true,
			playerTurn: 0,
			usedCities: [],
			playerTries: this.maxPlayerTries,
			inputAnotherWarn: false,
			curCityFact: '',
			curCityName: '',
			cityCount: 0
		}
	},
	methods: {
		startGame() {
			if (this.curPlayer.length > 2 && this.curPlayer.length < 15) {
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

		moveToNext(city) {
			this.inputAnotherWarn = false
			this.playerTries = this.maxPlayerTries
			if (data.cities.includes(city)) {
				if (!this.usedCities.includes(city)) {
					this.getCity(city)
					this.playerTurn = (this.playerTurn == this.playersQuan - 1 ? 0 : ++this.playerTurn)
					this.curPlayer = this.players[this.playerTurn]
					this.usedCities.push(city)
					this.cityCount++
				} else {
					if (this.playerTries) this.playerTries-- 
					else {
						this.stage = 3
					}
				}	
			} else {
				this.inputAnotherWarn = true
			}
		},

		handleCity() {
			if (!this.useMicro && this.city.length) 
				this.moveToNext(this.city)
			else if (this.useMicro) {
				recognition.start()

				recognition.onresult = (event) => {
					const last = event.results.length - 1
					let trans = event.results[last][0].transcript
					console.log(trans)
					this.moveToNext(trans)
				}
			}
		},

		getCity(searchQuery) {
			const url = `https://ru.wikipedia.org/w/api.php
						?action=opensearch
						&format=json
						&origin=*
						&limit=10
						&namespace=0
						&search=${searchQuery}`

			axios.get(url)
				.then(data => {
					this.curCityName = searchQuery
					this.curCityFact = data.data[2][0]
				})
				.catch(err => { throw new Error() })
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
		&__main-button
			font-size: 24px
			text-align: center
			padding: 10px 15px
			background-color: #feda6a
			color: white
			border-radius: 4px
			margin: 0 auto
			outline: none
			border: none
			margin-top: 30px
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
			margin: 20px 0
		&__stage
			&-one
				display: flex
				flex-direction: column
				align-items: center
			&-two
				width: 560px
		&__transition-wrapper
			display: flex
			flex-direction: column
			align-items: center
		&__main-input
			margin-top: 40px
			padding: 15px
			border: 1px solid #e3e4e9
			width: 90%
			box-shadow: 0 1px 4px #e3e4e9
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
			width: 50%
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

		&__without-micro
			& button 
				outline: none
				border: none
				padding: 15px 36px
				display: block
				color: #202020
				margin-top: 15px
				margin-left: auto
				cursor: pointer
				border-radius: 4px
				font-size: 18px
				background: none
				border: 1px solid #e3e4e9
				&:hover
					color: white
					background-color: #202020
					transition: .3s

		&__city
			&-name
				text-align: center
				margin-top: 50px
				color: #4D535D
				font-weight: 500
			&-fact
				padding: 15px   
				font-size: 14px
				margin-top: 15px
			&-name,
			&-fact
				animation: fadeIn .5s ease-in

			&-count
				position: absolute
				left: 40px
				top: 60px
				padding: 12px 14px
				font-size: 22px
				background-color: #feda6a
				border-radius: 50%
				color: #202020
</style>