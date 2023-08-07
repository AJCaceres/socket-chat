

// Funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre')
var sala = params.get('sala')

// Referencias de jquery
var divUsuarios =$('#divUsuarios')
var divChatbox =$('#divChatbox')
var formSend =$('#formSend')
var txtMessage =$('#txtMessage')


function renderUsers(persons){
    console.log("hola hola");

    var html = "";
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html += '</li>';


    for(var i=0; i<persons.length; i++){
        html += '<li>';
        html += '   <a data-id="'+ persons[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].nombre +' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }


    divUsuarios.html(html)
}

function renderMessages(message, me){

    var html = "";
    var fecha = new Date(message.fecha);
    var hora = fecha.getHours() +':'+fecha.getMinutes();

    var adminClass = 'info';
    if (message.name === 'Admin'){
        adminClass ='danger';
    }

    if (me) {
    html += '<li class="animated fadeIn">';
    html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html += '    <div class="chat-content">';
    html += '        <h5>'+ message.name+'</h5>';
    html += '        <div class="box bg-light-info">' + message.message + '</div>';
    html += '    </div>';
    html += '    <div class="chat-time">'+ hora +'</div>';
    html += '</li>';
    }
    else{
        html += '<li class="reverse">';
        if(message.name !== 'Admin'){
            html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ message.name+'</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">'+ message.message+'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



// Listeners
divUsuarios.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){
        console.log(id)
    }
})
formSend.on("submit", function(e){
    e.preventDefault()
    
    if(txtMessage.val().trim().length === 0){
        return;
    }
    socket.emit('createMessage', {
        nombre: nombre,
        mensaje: txtMessage.val()
    }, function(mensaje) {
        txtMessage.val('').focus();
        console.log("mensaje ", mensaje)
        renderMessages(mensaje, true);
        scrollBottom();
    });
})