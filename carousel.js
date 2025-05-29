var template= ` 
		
		
			<style>
			.carousel{
				position: relative;
				height: 600px;
				width: 80%;
				margin:0 auto;
				
			}
			.carousel_image{
				width: 100%;
				height: 100%;
				object-fit: cover;
				
				
				
			}

			.carousel_global_container{
				background:rgba(192,192,192, 1);
				height: 100%;
				position: relative;
				overflow:hidden;
			}

			.carousel_side_button{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				background : transparent;
				border: 0;
				cursor: pointer;


			}

			.carousel_inner_container{
				padding:0;
				margin: 0;
				list-style:none;
				position:relative;
				height: 100%;
				transition: transform 250ms ease-in;
				
				
			}

			.carousel_slide{
				position: absolute;
				top:0;
				bottom: 0;
				width: 100%;
				height: 100%;


			}

			.bleft{
				left:-20px;
				transform: rotate(-90deg);
			}

			.bright{
				right:-20px;
				transform: rotate(90deg);
			}

			.carousel_side_button img{
				width: 12px;
			}

			.carousel_nav{
				/*background: pink;*/
				display: flex;
				justify-content: center;
				padding: 10px 0;
			}

			.carousel_indicator{
				border: 0;
				border-radius: 50%;
				width: 15px;
				height: 15px;
				background: rgba(0,0,0, .3);
				margin: 0 12px;
				cursor: pointer;

			}

			.current_slide{
				background:rgba(0,0,0, .70);
				
			}

			.hidden{
				display:none;
			}



			</style>
			
			<div class="carousel">
				<button class="carousel_side_button bleft hidden">
					<img src="images/sidear2.png" alt="">
				</button>
				<div class="carousel_global_container">
					<ul id="slideContainer" class="carousel_inner_container">
						
					</ul>		
				</div>
				
				<button class="carousel_side_button bright">
					<img src="images/sidear2.png" alt="">
				</button>
				
				<div id=mindicator class="carousel_nav">
					
				</div>
			
			</div>
		`;	





class carousel extends HTMLElement{
	
	constructor(){
		super();
		this.shadow= this.attachShadow({mode:'open'});
		this.shadow.innerHTML=template;
		
		
	}
	
	moveToSlide(track, currentSlide, targetSlide){
		track.style.transform='translateX(-'+ targetSlide.style.left +')';
		currentSlide.classList.remove('current_slide');
		targetSlide.classList.add('current_slide');
		
	}
	
	updateDots(currentDot, targetDot){
	
		currentDot.classList.remove('current_slide');
		targetDot.classList.add('current_slide');

	};
		
	controlArrows(slides, nextButton, prevButton, targetIndex){
		if(targetIndex===0){
			prevButton.classList.add('hidden');
			nextButton.classList.remove('hidden');
		}else if(targetIndex === slides.length-1){
			prevButton.classList.remove('hidden');
			nextButton.classList.add('hidden');
		}else{
			prevButton.classList.remove('hidden');
			nextButton.classList.remove('hidden');
		}
	};

	
		
	
	connectedCallback(){
		
		const slideContainer1 = this.shadow.getElementById("slideContainer");
		
		var imglist=this.hasAttribute("imageset")? this.getAttribute("imageset") : 'Error';
		
		const findicator=this.shadow.getElementById("mindicator");
		
		
		
		if(imglist=='Error'){
			const listel= document.createElement('li');
			listel.classList.add('carousel_slide');
			const text1=document.createElement('h1');
			text1.setAttribute('style', "color: red");
			text1.innerHTML="Carousel: No Image";
			listel.appendChild(text1);
			slideContainer1.appendChild(listel.cloneNode(true));
			return null;
		}
		
		imglist= imglist.split(',');
		
		const listel= document.createElement('li');
		listel.classList.add('carousel_slide');
		const slimage= document.createElement('img');
		slimage.classList.add('carousel_image');
		const indicator= document.createElement('button');
		indicator.classList.add('carousel_indicator');
		
		listel.classList.add('current_slide');
		indicator.classList.add('current_slide');
		
		for(var i=0; i<imglist.length; i++){
			if(i!=0){
				listel.classList.remove('current_slide');
				indicator.classList.remove('current_slide');
				
			}
			slimage.setAttribute('src',imglist[i]);
			listel.appendChild(slimage);
			slideContainer1.appendChild(listel.cloneNode(true));
			findicator.appendChild(indicator.cloneNode(true));
			
		}
		
		
		

		const track= this.shadow.querySelector('.carousel_inner_container');
		const slides= Array.from(track.children);
		const nextButton=this.shadow.querySelector('.bright ');
		const prevButton=this.shadow.querySelector('.bleft ');
		const nav= this.shadow.querySelector('.carousel_nav');
		const dots= Array.from(nav.children);
		
		/*const slideSize=slides[0].getBoundingClientRect();*/
		const slideWidth=slides[0].getBoundingClientRect().width;
		
		
		const setSlidePosition=(slide, index)=>{
			slide.style.left = slideWidth * index + 'px';
		};
	
		
		slides.forEach(setSlidePosition);
		
		prevButton.addEventListener('click', e => {
			
			const currentSlide= track.querySelector('.current_slide');
			const prevSlide=currentSlide.previousElementSibling;
			const currentDot = nav.querySelector('.current_slide')
			const prevDot=currentDot.previousElementSibling;
			const prevIndex=slides.findIndex(slide => slide === prevSlide);
			
			this.moveToSlide(track, currentSlide, prevSlide);
			this.updateDots(currentDot, prevDot);
			this.controlArrows(slides, nextButton, prevButton, prevIndex);
		});
		
		
		nextButton.addEventListener('click', e=>{
			const currentSlide = track.querySelector('.current_slide');
			const nextSlide = currentSlide.nextElementSibling;
			const currentDot = nav.querySelector('.current_slide')
			const nextDot=currentDot.nextElementSibling;
			const nextIndex= slides.findIndex(slide => slide === nextSlide);
			
			/*const amountToMove= nextSlide.style.left;
			track.style.transform='translateX(-'+ amountToMove +')';
			currentSlide.classList.remove('current_slide');
			nextSlide.classList.add('current_slide');*/
				
			this.moveToSlide(track, currentSlide, nextSlide);
			this.updateDots(currentDot, nextDot);
			this.controlArrows(slides, nextButton, prevButton,  nextIndex);
			
		});
		
		nav.addEventListener('click', e => {
			
			const targetDot= e.target.closest('button');
			
			if(!targetDot) return;
			
			const currentSlide=track.querySelector('.current_slide');
			const currentDot= nav.querySelector('.current_slide');
			
			const targetIndex=dots.findIndex(dot => dot===targetDot);
			const targetSlide=slides[targetIndex];
			
			this.moveToSlide(track, currentSlide, targetSlide);
			this.updateDots(currentDot, targetDot);
			this.controlArrows(slides, nextButton,  prevButton, targetIndex);
			
			
		});
		
		
	}
}
	
window.customElements.define('carousel-com', carousel);