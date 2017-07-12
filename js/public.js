jQuery( function($){
	$(document).on('click', '.wcmp-player-container', function(evt){evt.preventDefault();evt.stopPropagation();});
	play_all = (typeof wcmp_global_settings != 'undefined') ? wcmp_global_settings[ 'play_all' ] : true; // Play all songs on page
	
	/**
	 * Play next player
	 */
	function _playNext( playerNumber )
	{
		if( playerNumber+1 < player_counter )
		{
			var toPlay = playerNumber+1;
			if( players[ toPlay ] instanceof jQuery && players[ toPlay ].is( 'a' ) ) players[ toPlay ].click();
			else players[ toPlay ].play();
		}	
	};
	
	jQuery.expr[':'].regex = function(elem, index, match) {
		var matchParams = match[3].split(','),
			validLabels = /^(data|css):/,
			attr = {
				method: matchParams[0].match(validLabels) ? 
							matchParams[0].split(':')[0] : 'attr',
				property: matchParams.shift().replace(validLabels,'')
			},
			regexFlags = 'ig',
			regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
		return regex.test(jQuery(elem)[attr.method](attr.property));
	}
	
	//------------------------ MAIN CODE ------------------------
	var players = [],
		player_counter = 0,
		s = $('.wcmp-player:not(.track)'),
		m = $('.wcmp-player.track'),
		c = {
				iPadUseNativeControls: false,
				iPhoneUseNativeControls: false,
				success: function( media, dom ){
					media.addEventListener( 'timeupdate', function( e ){
						if( !isNaN( this.currentTime ) && !isNaN( this.duration ) && this.src.indexOf( 'ms-action=secure' ) != -1 )
						{
							if( this.duration - this.currentTime < 4 )
							{
								this.setVolume( this.volume - this.volume / 3 );
							}
							else
							{
								if( typeof this[ 'bkVolume' ] == 'undefined' ) this[ 'bkVolume' ] = this.volume;
								this.setVolume( this.bkVolume );
							}	
							
						}
					});
					media.addEventListener( 'volumechange', function( e ){
						if( !isNaN( this.currentTime ) && !isNaN( this.duration ) && this.src.indexOf( 'ms-action=secure' ) != -1 )
						{
							if( ( this.duration - this.currentTime > 4 ) && this.currentTime )  this[ 'bkVolume' ] = this.volume;
						}
					});
					
					media.addEventListener( 'ended', function( e ){
						if( play_all )
						{
							var playerNumber = $(this).attr('playerNumber')*1;
							_playNext( playerNumber );
						}
					});
				}
			};
	
	s.each(function(){
		var e 	= $(this),
			src = e.find( 'source' ).attr( 'src' );
			
		c['audioVolume'] = 'vertical';
		players[ player_counter ] = new MediaElementPlayer(e, c);
		e.attr('playerNumber', player_counter);
		player_counter++;
	});
	
	
	m.each(function(){
		var e = $(this),
			src = e.find( 'source' ).attr( 'src' );
		
		c['features'] = ['playpause'];
		players[ player_counter ] = new MediaElementPlayer(e, c);
		e.attr('playerNumber', player_counter);
		player_counter++;
	});
	
	$('.product-type-grouped [data-product_id],.product-type-grouped :regex(name,quantity\\[\\d+\\])').each(function(){
		var e = $(this),
			i = e.data( 'product_id' )||e.attr('name').replace(/[^\d]/g,''),
			c = $( '.wcmp-player-list.merge_in_grouped_products .product-'+i+':last .wcmp-player-title' ),
			t = $('<table></table>');
		
		if(c.length)
		{
			if(c.closest('form').length == 0)
			{
				c.closest('.wcmp-player-list').prependTo(e.closest('form'));
			}	
			t.append(e.closest('tr').prepend('<td>'+c.html()+'</td>'));
			c.html('').append(t);
		}	
	});
});